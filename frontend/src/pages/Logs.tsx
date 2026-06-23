import { useState } from "react";
import { Box, Chip } from "@mui/material";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import { useAuth } from "../context/AuthContext";
import { useLogs } from "../hooks/useLogs";
import { useToast } from "../context/ToastContext";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import StatCard from "../components/dashboard/StatCard";
import type { LogEntry } from "../types";

/* ─── Shared layout ─── */

const GRID_COLUMNS = "200px 1.5fr 1.5fr 0.8fr 220px";
const GRID_MIN_WIDTH = 900;

/* ─── Table header style ─── */

const TABLE_HEADER_SX = {
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-muted)",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  fontFamily: "'Poppins', sans-serif",
} as const;

const TABLE_COLUMNS = [
  "WAKTU",
  "TARGET",
  "HOST / URL",
  "PROTOKOL",
  "PERUBAHAN STATUS",
] as const;

/* ─── Table cell styles ─── */

const CELL_DATE_SX = {
  color: "var(--text-muted)",
  fontSize: "0.85rem",
  fontWeight: 500,
  fontFamily: "monospace",
} as const;

const CELL_NAME_SX = {
  fontWeight: 600,
  color: "var(--text-heading)",
  fontSize: "14px",
  fontFamily: "'Poppins', sans-serif",
} as const;

const CELL_HOST_SX = {
  color: "var(--text-muted)",
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: "'JetBrains Mono', monospace",
} as const;

const CELL_PROTOCOL_SX = {
  fontSize: "14px",
  color: "var(--text-body)",
  fontWeight: 500,
  fontFamily: "'JetBrains Mono', monospace",
} as const;

/* ─── Helpers ─── */

function formatLogDate(dateStr: string): string {
  const iso = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
  const parsedStr = iso.endsWith("Z") ? iso : iso + "Z";
  const d = new Date(parsedStr);
  const dateOpts: Intl.DateTimeFormatOptions = { 
    timeZone: "Asia/Jakarta", 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  };
  const timeOpts: Intl.DateTimeFormatOptions = { 
    timeZone: "Asia/Jakarta", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit",
    hour12: false 
  };

  const datePart = d.toLocaleDateString("en-GB", dateOpts);
  const timePart = d.toLocaleTimeString("en-GB", timeOpts);

  return `${datePart} · ${timePart} WIB`;
}

/* ─── Component ─── */

export default function Logs() {
  const { activeTeamId } = useAuth();
  const { logs, stats, clearLogs } = useLogs(activeTeamId);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClearLogs = async () => {
    try {
      await clearLogs();
      setConfirmOpen(false);
      showToast("Riwayat log berhasil dibersihkan", "success");
    } catch {
      showToast("Gagal membersihkan riwayat log.", "error");
    }
  };

  /* ── No team selected ── */

  if (!activeTeamId) {
    return (
      <EmptyState
        icon="📋"
        title="Belum ada tim dipilih"
        description={
          <>
            Pilih tim dari menu{" "}
            <Box component="span" sx={{ color: "var(--accent)", fontWeight: 500 }}>
              Tim &amp; Pengaturan
            </Box>
          </>
        }
      />
    );
  }

  /* ── Main render ── */

  const isLogsEmpty = logs.length === 0;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        animation: "fadeInUp 0.45s var(--ease-out)",
      }}
    >
      {/* Page header + clear action */}
      <PageHeader
        title="Riwayat Log"
        subtitle="Jejak rekam historis perubahan status peladenmu"
        action={
          <Button
            variant="secondary"
            onClick={() => setConfirmOpen(true)}
            disabled={isLogsEmpty}
            icon={<DeleteSweepRoundedIcon sx={{ fontSize: 18 }} />}
            style={{
              borderRadius: "8px",
              background: isLogsEmpty
                ? "var(--bg-surface)"
                : "rgba(220, 38, 38, 0.1)",
              border: `1px solid ${
                isLogsEmpty ? "var(--border)" : "rgba(220, 38, 38, 0.2)"
              }`,
              color: isLogsEmpty ? "var(--text-subtle)" : "var(--danger)",
            }}
          >
            Bersihkan Log
          </Button>
        }
      />

      {/* Stat cards */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
          mb: 3,
          overflow: "hidden",
          transition: "box-shadow 0.25s var(--ease-out)",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
          },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ flex: 1, borderRight: { xs: "none", sm: "1px solid #F1F5F9" }, borderBottom: { xs: "1px solid #F1F5F9", sm: "none" } }}>
          <StatCard label="Total Event" value={stats.total} color="var(--accent)" delay={0} />
        </Box>
        <Box sx={{ flex: 1, borderRight: { xs: "none", sm: "1px solid #F1F5F9" }, borderBottom: { xs: "1px solid #F1F5F9", sm: "none" } }}>
          <StatCard label="Incident" value={stats.downCount} color="var(--danger)" delay={80} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard label="Recovery" value={stats.upCount} color="var(--success)" delay={160} />
        </Box>
      </Box>

      {/* Log table card */}
      <Box
        sx={{
          bgcolor: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          overflowX: "auto",
          transition: "box-shadow 0.25s",
          "&:hover": { boxShadow: "var(--shadow-xl)" },
        }}
      >
        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: GRID_COLUMNS,
            minWidth: GRID_MIN_WIDTH,
            px: 2.5,
            py: 1.3,
            borderBottom: "1px solid var(--border)",
            alignItems: "center",
          }}
        >
          {TABLE_COLUMNS.map((label) => (
            <Box
              key={label}
              sx={{
                ...TABLE_HEADER_SX,
                textAlign: label === "PERUBAHAN STATUS" ? "center" : "left",
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        {/* Table body */}
        {isLogsEmpty ? (
          <Box sx={{ py: 6, textAlign: "center", color: "var(--text-muted)" }}>
            <Box sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Belum ada riwayat log
            </Box>
            <Box sx={{ fontSize: "0.8rem", mt: 0.5 }}>
              Semua sistem berjalan normal
            </Box>
          </Box>
        ) : (
          logs.map((log: LogEntry, i: number) => {
            const isUp = log.status === "UP";

            return (
              <Box
                key={log.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: GRID_COLUMNS,
                  minWidth: GRID_MIN_WIDTH,
                  px: 2.5,
                  py: 1.5,
                  alignItems: "center",
                  borderBottom: "1px solid var(--border-light)",
                  transition: "all 0.18s var(--ease-out)",
                  animation: `fadeInUp 0.4s var(--ease-out) ${i * 30}ms both`,
                  "&:hover": { bgcolor: "var(--bg-card-hover)" },
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                {/* Waktu */}
                <Box sx={CELL_DATE_SX}>
                  {formatLogDate(log.created_at)}
                </Box>

                {/* Target name */}
                <Box sx={CELL_NAME_SX}>
                  {log.target_name}
                </Box>

                {/* Host / URL */}
                <Box sx={CELL_HOST_SX}>
                  {log.target_host}
                </Box>

                {/* Protokol */}
                <Box sx={CELL_PROTOCOL_SX}>
                  {log.target_protocol}
                </Box>

                {/* Status chip */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Chip
                    label={isUp ? "RECOVERED · UP" : "INCIDENT · DOWN"}
                    size="small"
                    sx={{
                      borderRadius: "var(--radius-sm)",
                      bgcolor: isUp ? "var(--status-up-bg)" : "var(--status-down-bg)",
                      color: isUp ? "var(--status-up)" : "var(--status-down)",
                      border: `1px solid ${
                        isUp ? "var(--status-up-border)" : "var(--status-down-border)"
                      }`,
                      "& .MuiChip-label": { px: 1.2 },
                    }}
                  />
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Confirm clear dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Konfirmasi Hapus Log"
        confirmLabel="Hapus Semua"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleClearLogs}
      >
        Semua riwayat log untuk tim ini akan{" "}
        <Box component="span" sx={{ color: "var(--danger)", fontWeight: 600 }}>
          dihapus permanen
        </Box>
        . Tindakan ini tidak dapat dibatalkan.
      </ConfirmDialog>
    </Box>
  );
}
