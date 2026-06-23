import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthForm } from "../hooks/useAuthForm";
import { authApi } from "../services/api";
import { AuthLayout, AuthInput, AuthButton, AuthLink } from "../components/layout/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    email, password, errorMsg, loading,
    setEmail, setPassword, setErrorMsg, setLoading,
  } = useAuthForm();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      login({ id: data.userId, email });
      navigate("/");
    } catch {
      setErrorMsg("Email atau password salah. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Victie Monitor"
      subtitle="Secure Network Intelligence"
      icon="monitor_heart"
    >
      {errorMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            color: "#DC2626",
            fontSize: "14px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          icon="email"
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="•••••"
          icon="lock"
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
          <input id="remember" type="checkbox" style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
          <label htmlFor="remember" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#64748B", cursor: "pointer" }}>
            Remember device
          </label>
        </div>

        <AuthButton loading={loading} label="Authenticate" loadingLabel="Authenticating..." />
      </form>

      <AuthLink text="Belum punya akun?" linkText="Create an account" to="/register" />
    </AuthLayout>
  );
}
