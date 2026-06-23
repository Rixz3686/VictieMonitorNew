import nodemailer from "nodemailer";
import db from "../../config/database";
import type { Target } from "../../types";

let _emailTransporter: nodemailer.Transporter | null = null;

function getEmailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!_emailTransporter) {
    _emailTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      pool: true,
      maxConnections: 3,
      socketTimeout: 10000,
    });
  }
  return _emailTransporter;
}

const teamEmailQuery = db.query<{ email: string }, { $teamId: string }>(`
  SELECT u.email FROM users u
  JOIN team_members tm ON u.id = tm.user_id
  WHERE tm.team_id = $teamId
`);

export async function sendEmailAlert(
  target: Target,
  status: "UP" | "DOWN",
  latency: number,
) {
  const transporter = getEmailTransporter();
  if (!transporter) return;

  const teamUsers = teamEmailQuery.all({ $teamId: target.team_id });
  if (teamUsers.length === 0) return;

  const targetEmails = teamUsers.map((u) => u.email).join(", ");
  const isDown = status === "DOWN";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #fce4ec; border-radius: 10px; max-width: 600px; background-color: #f9fafb;">
      <h2 style="color: ${isDown ? "#e91e63" : "#059669"}; margin-bottom: 20px;">
        ${isDown ? "🚨 SERVER DOWN 🚨" : "✅ SERVER RECOVERED ✅"}
      </h2>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <p style="margin: 5px 0;"><strong>🎯 Target:</strong> ${target.name}</p>
        <p style="margin: 5px 0;"><strong>🌐 Host:</strong> <a href="${target.host}" style="color: #0ea5e9;">${target.host}</a></p>
        <p style="margin: 5px 0;"><strong>🔌 Protokol:</strong> ${target.protocol}</p>
        ${!isDown ? `<p style="margin: 5px 0;"><strong>⚡ Latensi:</strong> ${latency} ms</p>` : ""}
        <p style="margin: 5px 0;"><strong>🕒 Waktu:</strong> ${new Date().toLocaleString("id-ID")}</p>
      </div>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 20px; text-align: center;">Victie Monitoring System</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Victie Alerts" <${process.env.SMTP_USER}>`,
      to: targetEmails,
      subject: isDown
        ? `🚨 ALERT: ${target.name} is DOWN`
        : `✅ RECOVERED: ${target.name} is UP`,
      html: htmlContent,
    });
    console.log(`📧 Email terkirim ke: ${targetEmails}`);
  } catch {}
}
