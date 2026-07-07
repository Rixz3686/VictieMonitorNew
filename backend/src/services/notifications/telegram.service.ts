import { env } from "cloudflare:workers";

export async function sendTelegramAlert(message: string) {
  const workerEnv = env as any;
  const token = workerEnv.TELEGRAM_BOT_TOKEN;
  const chatId = workerEnv.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {}
}
