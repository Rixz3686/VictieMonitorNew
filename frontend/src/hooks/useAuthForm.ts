import { useState } from "react";

interface UseAuthFormReturn {
  email: string;
  password: string;
  errorMsg: string;
  successMsg: string;
  loading: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setErrorMsg: (v: string) => void;
  setSuccessMsg: (v: string) => void;
  setLoading: (v: boolean) => void;
  resetMessages: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = (): void => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  return {
    email,
    password,
    errorMsg,
    successMsg,
    loading,
    setEmail,
    setPassword,
    setErrorMsg,
    setSuccessMsg,
    setLoading,
    resetMessages,
  };
};
