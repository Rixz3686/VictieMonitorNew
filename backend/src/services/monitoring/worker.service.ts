import db from "../../config/database";
import type { Target } from "../../types";
import { runCheck } from "./index";
import { sendNotifications } from "../notifications";
import { targetsService } from "../database/targets.service";
import { HISTORY_LIMIT } from "../../config/constants";

const isChecking = new Set<string>();

async function handleTarget(target: Target, now: number) {
  if (isChecking.has(target.id)) return;
  isChecking.add(target.id);

  try {
    const { status, latency, errorReason, errorDetails } = await runCheck(target);
    const oldStatus = target.current_status;

    if (status === "DOWN" && oldStatus !== "DOWN") {
      sendNotifications(target, "DOWN", 0).catch((err) => console.error("[Worker] Gagal mengirim notifikasi:", err));
      await targetsService.insertIncidentLog(target.id, "DOWN", errorReason, errorDetails);
    } else if (status === "UP" && oldStatus === "DOWN") {
      sendNotifications(target, "UP", latency).catch((err) => console.error("[Worker] Gagal mengirim notifikasi:", err));
      await targetsService.insertIncidentLog(target.id, "UP");
    }

    await targetsService.updateStatus(target.id, status, latency);
    await targetsService.insertPingHistory(target.id, status, latency);
  } catch (err) {
    console.error(`[Worker] Gagal mengecek target "${target.name}" (${target.host}):`, err);
  } finally {
    isChecking.delete(target.id);
    const intervalMs = Math.max(target.interval_seconds || 60, 5) * 1000;
    await targetsService.updateNextCheckTime(target.id, Date.now() + intervalMs);
  }
}

export async function runScheduledCheck() {
  const now = Date.now();
  try {
    const targets = await targetsService.findDueTargets(now);
    
    if (targets.length > 0) {
      // Lock targets immediately
      await Promise.all(targets.map((target) => {
        const lockDuration = Math.max(target.interval_seconds || 60, 30) * 1000;
        return targetsService.updateNextCheckTime(target.id, now + lockDuration);
      }));

      // Check all targets in parallel
      await Promise.allSettled(targets.map((target) => handleTarget(target, now)));
    }

    // Perform pruning occasionally (approx. 10% of execution runs)
    if (Math.random() < 0.10) {
      console.log("🧹 Memulai pembersihan histori ping lama secara massal...");
      await targetsService.pruneAllPingHistory(HISTORY_LIMIT);
      console.log("🧹 Pembersihan histori ping selesai.");
    }
  } catch (err) {
    console.error("[Worker] Error pada scheduler loop:", err);
  }
}

// For backward compatibility / local development start
export function startMonitoringWorker() {
  console.log("⚙️  Background Worker berjalan (mode local dev)");
  const runLoop = async () => {
    await runScheduledCheck();
    setTimeout(runLoop, 1000);
  };
  setTimeout(runLoop, 1000);
}
