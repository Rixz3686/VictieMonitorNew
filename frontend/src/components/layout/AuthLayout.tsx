import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: string;
}

export const AuthLayout = ({ children, title, subtitle, icon }: AuthLayoutProps) => {
  return (
    <>
      <style>
        {`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .auth-input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            color: #111827;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            transition: all 0.2s;
            box-sizing: border-box;
          }
          .auth-input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(221, 123, 141, 0.15);
          }
          .auth-btn {
            width: 100%;
            margin-top: 8px;
            padding: 14px;
            background-color: var(--accent);
            color: #FFFFFF;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(221, 123, 141, 0.2), 0 2px 4px -1px rgba(221, 123, 141, 0.1);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
          }
          .auth-btn:hover:not(:disabled) {
            background-color: var(--accent-dark);
            transform: translateY(-1px);
            box-shadow: 0 6px 8px -1px rgba(221, 123, 141, 0.25), 0 4px 6px -1px rgba(221, 123, 141, 0.1);
          }
          .auth-btn:active:not(:disabled) {
            transform: scale(0.98);
          }
          .auth-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      </style>
      <main
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#F8FAFC",
          fontFamily: "'Poppins', sans-serif",
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased"
        }}
      >
        {/* Background Element */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundColor: "#0F172A" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(221, 123, 141, 0.4), transparent)", opacity: 0.8 }}></div>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5 }}></div>
          
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", mixBlendMode: "overlay", opacity: 0.2 }}>
            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWCt8YOGI2QbQTp7D0AKJMQBMXPRKsqb481lJkc0XsMo4DHWDiP65FEyOz8Fmo6SNwJUqiiluz2UbJnzgRPEYRaK9ueFlm2VCUe-Fz2VZNm5xGBFcnUDWyroNCiHe0kAuzqvtAVP5_4ay_V1w3ZzQ1y6f0h960EY6a9VVoGe2faDXQa3chi4DG_MqELlHUbZVkwhczZqanr6YtsEs98azy2MJdbeg2EI3wU61j8rKaU0SfcOAdTQYRT3Qy_REmiSpqpQJ-AboTLvY" alt="Server Background" />
          </div>
        </div>

        {/* Auth Container */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 448,
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          border: "none",
          overflow: "hidden"
        }}>
          {/* Brand & Header */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "center", alignItems: "center" }}>
            <div style={{ width: 56, height: 56, backgroundColor: "var(--accent)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-accent)", marginBottom: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#FFFFFF", fontSize: 28, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: title.length > 20 ? "32px" : "40px", color: "#111827", letterSpacing: "-0.02em", margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#64748B", margin: title.length > 20 ? "8px 0 0 0" : 0 }}>
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </main>
    </>
  );
};

interface AuthInputProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  placeholder?: string;
}

export const AuthInput = ({ label, id, type, value, onChange, icon, placeholder = "" }: AuthInputProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label htmlFor={id} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.02em" }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, paddingLeft: "8px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
        <span className="material-symbols-outlined" style={{ color: "#94A3B8" }}>{icon}</span>
      </div>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="auth-input"
      />
    </div>
  </div>
);

interface AuthButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}

export const AuthButton = ({ loading, label, loadingLabel }: AuthButtonProps) => (
  <button type="submit" disabled={loading} className="auth-btn">
    {loading ? loadingLabel : label}
    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
  </button>
);

interface AuthLinkProps {
  text: string;
  linkText: string;
  to: string;
}

export const AuthLink = ({ text, linkText, to }: AuthLinkProps) => (
  <div style={{ marginTop: "16px", borderTop: "1px solid #E2E8F0", paddingTop: "16px", textAlign: "center" }}>
    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#64748B", margin: 0 }}>
      {text}{" "}
      <Link
        to={to}
        style={{
          fontFamily: "'Poppins', sans-serif",
          color: "var(--accent)",
          fontWeight: 600,
          textDecoration: "none"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {linkText}
      </Link>
    </p>
  </div>
);
