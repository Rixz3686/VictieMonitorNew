import { useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { teamsApi } from "../../services/api";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import axios from "axios";

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onTeamCreated: (teamId: string, teamName: string) => void;
}

export default function CreateTeamDialog({
  open,
  onClose,
  onTeamCreated,
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await teamsApi.create(teamName);
      setSuccessMsg(`Tim "${teamName}" berhasil dibuat!`);
      onTeamCreated(data.teamId, teamName);
      setTeamName("");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) return;
        const errorMsg = err.response?.data?.error || "Gagal membuat tim.";
        alert(errorMsg);
      } else {
        alert("Gagal membuat tim.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          m: { xs: 2, sm: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #E2E8F0",
          fontSize: "1.25rem",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        Buat Tim Baru
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            mb: 3,
            pt: 2,
            fontWeight: 400,
          }}
        >
          Pisahkan target monitoringmu ke dalam ruang kerja yang berbeda.
        </Box>
        {successMsg && (
          <Box
            sx={{
              mb: 3,
              p: "12px 16px",
              borderRadius: "8px",
              bgcolor: "rgba(22, 163, 74, 0.1)",
              border: "1px solid rgba(22, 163, 74, 0.2)",
              color: "#16A34A",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ✅ {successMsg}
          </Box>
        )}
        <form id="create-team-form" onSubmit={handleSubmit}>
          <Input
            label="Nama Tim"
            value={teamName}
            onChange={setTeamName}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="create-team-form"
          disabled={loading}
          style={{ borderRadius: 10 }}
        >
          {loading ? "Membuat..." : "Buat Tim →"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
