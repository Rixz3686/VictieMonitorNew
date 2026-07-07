import type { Target } from "../../types";
import process from "node:process";

export async function sendDiscordAlert(
  target: Target,
  status: "UP" | "DOWN",
  latency: number,
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  const isDown = status === "DOWN";
  const embed = {
    title: isDown ? "🚨 SERVER DOWN 🚨" : "✅ SERVER RECOVERED ✅",
    color: isDown ? 15548997 : 5763719,
    fields: [
      { name: "🎯 Target", value: target.name, inline: true },
      { name: "🌐 Host", value: `\`${target.host}\``, inline: true },
      { name: "🔌 Protokol", value: target.protocol, inline: true },
      ...(isDown
        ? []
        : [{ name: "⚡ Latensi", value: `${latency} ms`, inline: true }]),
      { name: "🕒 Waktu", value: new Date().toLocaleString("id-ID") },
    ],
  };
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {}
}
