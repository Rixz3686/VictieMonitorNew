import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../context/AuthContext";
import { useTargets } from "../hooks/useTargets";
import { useTargetForm } from "../hooks/useTargetForm";
import { useTargetStats } from "../hooks/useTargetStats";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { TargetTable } from "../components/dashboard/TargetTable";
import { TargetFormDialog } from "../components/dashboard/TargetFormDialog";
import DetailPanel from "../components/dashboard/DetailPanel";
import type { Target } from "../types";

export default function Dashboard() {
  const { activeTeamId } = useAuth();
  const { targets, createMutation, updateMutation, deleteMutation } =
    useTargets(activeTeamId ?? "");
  const stats = useTargetStats(targets);
  const { showToast } = useToast();
  const {
    form,
    open,
    editingId,
    handleOpenNew,
    handleOpenEdit,
    handleClose,
    handleChange,
    getPayload,
  } = useTargetForm();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const detailTarget = useMemo<Target | null>(() => {
    if (!selectedTargetId) return null;
    return targets.find((t: Target) => t.id === selectedTargetId) ?? null;
  }, [targets, selectedTargetId]);

  const handleSave = async () => {
    try {
      const payload = getPayload();
      if (editingId) {
        await updateMutation.mutateAsync({ targetId: editingId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleClose();
      showToast("Target berhasil disimpan!", "success");
    } catch {
      showToast("Gagal menyimpan target!", "error");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
      setSelectedTargetId(null);
      showToast("Target berhasil dihapus!", "success");
    } catch {
      showToast("Gagal menghapus target!", "error");
    }
  };

  if (!activeTeamId) {
    return (
      <EmptyState
        icon="🏗️"
        title="Belum ada tim dipilih"
        description={
          <>
            Silakan buat atau pilih tim dari menu{" "}
            <Box component="span" sx={{ color: "var(--accent)", fontWeight: 600 }}>
              Tim & Pengaturan
            </Box>
          </>
        }
      />
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        animation: "fadeInUp 0.45s var(--ease-out)",
      }}
    >
      <PageHeader
        title="Dashboard"
        subtitle="Pantau status server dan layananmu secara real-time"
        action={
          <Button
            variant="primary"
            onClick={handleOpenNew}
            icon={<AddIcon sx={{ fontSize: 18 }} />}
          >
            Add New Target
          </Button>
        }
      />

      <StatsGrid
        total={stats.total}
        upCount={stats.upCount}
        downCount={stats.downCount}
        avgLatency={stats.avgLatency}
      />

      <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start", flexWrap: "wrap" }}>
        <TargetTable
          targets={targets}
          detailTarget={detailTarget}
          onSelect={(t) => setSelectedTargetId(t?.id ?? null)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {detailTarget && (
          <DetailPanel
            target={detailTarget}
            activeTeamId={activeTeamId}
            onEdit={() => handleOpenEdit(detailTarget)}
            onDelete={() => handleDelete(detailTarget.id)}
            onClose={() => setSelectedTargetId(null)}
          />
        )}
      </Box>

      <TargetFormDialog
        open={open}
        editingId={editingId}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteConfirmId}
        title="Konfirmasi Hapus Target"
        confirmLabel="Hapus Target"
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
      >
        Apakah Anda yakin ingin menghapus target ini? Data histori target ini
        akan{" "}
        <Box component="span" sx={{ color: "#EF4444", fontWeight: 700 }}>
          hilang permanen
        </Box>
        .
      </ConfirmDialog>
    </Box>
  );
}
