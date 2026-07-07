import type { Target } from "../../types";
import { sendTelegramAlert } from "./telegram.service";
import { sendDiscordAlert } from "./discord.service";

export async function sendNotifications(
  target: Target,
  status: "UP" | "DOWN",
  latency: number,
) {
  const isDown = status === "DOWN";
  
  const telegramMessage = isDown
    ? `🚨 *SERVER DOWN* 🚨\n\n*Target:* ${target.name}\n*Host:* \`${target.host}\`\n*Protokol:* ${target.protocol}\n*Waktu:* ${new Date().toLocaleString("id-ID")}`
    : `✅ *SERVER RECOVERED* ✅\n\n*Target:* ${target.name}\n*Host:* \`${target.host}\`\n*Protokol:* ${target.protocol}\n*Latensi:* ${latency} ms\n*Waktu:* ${new Date().toLocaleString("id-ID")}`;

  await Promise.all([
    sendTelegramAlert(telegramMessage),
    sendDiscordAlert(target, status, latency),
  ]);
}

export * from "./telegram.service";
export * from "./discord.service";
