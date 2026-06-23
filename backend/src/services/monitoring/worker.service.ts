import db from "../../config/database";
import type { Target } from "../../types";
import { runCheck } from "./index";
import { sendNotifications } from "../notifications";
import { targetsService } from "../database/targets.service";
import { HISTORY_LIMIT } from "../../config/constants";

declare global {
  var monitorInterval: Timer | undefined;
  var pruningInterval: Timer | undefined;
}

if (globalThis.monitorInterval) {
  clearTimeout(globalThis.monitorInterval);
}
if (globalThis.pruningInterval) {
  clearInterval(globalThis.pruningInterval);
}

const isChecking = new Set<string>();

async function handleTarget(target: Target, now: number) {
  if (isChecking.has(target.id)) return;
  isChecking.add(target.id);

  try {
    const { status, latency, errorReason, errorDetails } = await runCheck(target);
    const oldStatus = target.current_status;

    if (status === "DOWN" && oldStatus !== "DOWN") {
      sendNotifications(target, "DOWN", 0).catch((err) => console.error("[Worker] Gagal mengirim notifikasi:", err));
      targetsService.insertIncidentLog(target.id, "DOWN", errorReason, errorDetails);
    } else if (status === "UP" && oldStatus === "DOWN") {
      sendNotifications(target, "UP", latency).catch((err) => console.error("[Worker] Gagal mengirim notifikasi:", err));
      targetsService.insertIncidentLog(target.id, "UP");
    }

    db.transaction(() => {
      targetsService.updateStatus(target.id, status, latency);
      targetsService.insertPingHistory(target.id, status, latency);
    })();
  } catch (err) {
    console.error(`[Worker] Gagal mengecek target "${target.name}" (${target.host}):`, err);
  } finally {
    isChecking.delete(target.id);
    
    const intervalMs = Math.max(target.interval_seconds || 60, 5) * 1000;
    targetsService.updateNextCheckTime(target.id, Date.now() + intervalMs);
  }
}

export function startMonitoringWorker() {
  console.log("⚙️  Background Worker berjalan");

  const runLoop = async () => {
    try {
      const now = Date.now();
      const targets = targetsService.findDueTargets(now);
      
      if (targets.length > 0) {
        db.transaction(() => {
          for (const target of targets) {
            const lockDuration = Math.max(target.interval_seconds || 60, 30) * 1000;
            targetsService.updateNextCheckTime(target.id, now + lockDuration);
          }
        })();

        await Promise.allSettled(targets.map((target) => handleTarget(target, now)));
      }
    } catch (err) {
      console.error("[Worker] Error pada scheduler loop:", err);
    } finally {
      globalThis.monitorInterval = setTimeout(runLoop, 1000);
    }
  };

  globalThis.monitorInterval = setTimeout(runLoop, 1000);

  console.log("⚙️  Background Pruner dijadwalkan");
  globalThis.pruningInterval = setInterval(() => {
    try {
      console.log("🧹 Memulai pembersihan histori ping lama secara massal...");
      targetsService.pruneAllPingHistory(HISTORY_LIMIT);
      console.log("🧹 Pembersihan histori ping selesai.");
    } catch (err) {
      console.error("[Worker] Gagal membersihkan histori ping:", err);
    }
  }, 15 * 60 * 1000); // 15 menit
  
  setTimeout(() => {
    try {
      targetsService.pruneAllPingHistory(HISTORY_LIMIT);
    } catch (err) {
      console.error("[Worker] Gagal melakukan pruning awal:", err);
    }
  }, 5000);
}
