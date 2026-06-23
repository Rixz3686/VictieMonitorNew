import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { authApi } from "../services/api";
import { AuthLayout, AuthInput, AuthButton, AuthLink } from "../components/layout/AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const {
    email, password, errorMsg, successMsg, loading,
    setEmail, setPassword, setErrorMsg, setSuccessMsg, setLoading,
    resetMessages,
  } = useAuthForm();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      await authApi.register(email, password);
      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setErrorMsg("Pendaftaran gagal. Email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Bergabunglah dan pantau infrastrukturmu"
      icon="person_add"
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

      {successMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(22, 163, 74, 0.1)",
            border: "1px solid rgba(22, 163, 74, 0.2)",
            color: "#16A34A",
            fontSize: "14px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
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

        <AuthButton loading={loading} label="Daftar Sekarang" loadingLabel="Memproses..." />
      </form>

      <AuthLink text="Sudah punya akun?" linkText="Masuk di sini" to="/login" />
    </AuthLayout>
  );
}
