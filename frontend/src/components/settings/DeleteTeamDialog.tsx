import { useState } from "react";
import { Box } from "@mui/material";
import { teamsApi } from "../../services/api";
import { ConfirmDialog } from "../common/ConfirmDialog";
import axios from "axios";

interface DeleteTeamDialogProps {
  open: boolean;
  onClose: () => void;
  teamId: string | null;
  teamName: string;
  onDeleted: () => void;
}

export default function DeleteTeamDialog({
  open,
  onClose,
  teamId,
  teamName,
  onDeleted,
}: DeleteTeamDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      await teamsApi.delete(teamId);
      onDeleted();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) return;
        alert(err.response?.data?.error || "Gagal menghapus tim.");
      } else {
        alert("Gagal menghapus tim.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Hapus Tim"
      confirmLabel="Hapus Tim"
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    >
      Apakah Anda yakin ingin menghapus tim{" "}
      <Box component="span" sx={{ fontWeight: 700, color: "var(--text-heading)" }}>
        "{teamName}"
      </Box>
      ? Semua target, riwayat ping, dan log insiden dalam tim ini akan{" "}
      <Box component="span" sx={{ color: "#EF4444", fontWeight: 700 }}>
        hilang permanen
      </Box>
      .
    </ConfirmDialog>
  );
}
