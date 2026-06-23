import { Box } from "@mui/material";
import TargetRow from "./TargetRow";
import type { Target } from "../../types";

interface TargetTableProps {
  targets: Target[];
  detailTarget: Target | null;
  onSelect: (target: Target | null) => void;
  onEdit: (target: Target) => void;
  onDelete: (id: string) => void;
}

export const TargetTable = ({
  targets,
  detailTarget,
  onSelect,
  onEdit,
  onDelete,
}: TargetTableProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
        overflowX: "auto",
        transition: "box-shadow 0.25s",
        "&:hover": { boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr 0.8fr 1fr 90px",
          minWidth: 700,
          px: 2.5,
          py: 1.3,
          borderBottom: "1px solid var(--border)",
          alignItems: "center",
        }}
      >
        {["TARGET", "HOST / URL", "PROTOKOL", "STATUS", "AKSI"].map((label) => (
          <Box
            key={label}
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748B",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              fontFamily: "'Poppins', sans-serif",
              textAlign: label === "STATUS" || label === "AKSI" ? "center" : "left",
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      {targets.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center", color: "var(--text-muted)" }}>
          <Box sx={{ fontSize: "2rem", mb: 1 }}>📡</Box>
          <Box sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
            Belum ada target monitoring
          </Box>
          <Box sx={{ fontSize: "0.8rem", mt: 0.5 }}>
            Klik "Target Baru" untuk memulai
          </Box>
        </Box>
      ) : (
        targets.map((t, i) => (
          <TargetRow
            key={t.id}
            target={t}
            index={i}
            isSelected={detailTarget?.id === t.id}
            onSelect={(target) =>
              onSelect(detailTarget?.id === target.id ? null : target)
            }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}

      {targets.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontWeight: 400,
            }}
          >
            {targets.length} target terdaftar
          </Box>
          <Box
            sx={{
              fontSize: "0.78rem",
              color: "var(--text-subtle)",
              fontWeight: 400,
            }}
          >
            Auto-refresh aktif
          </Box>
        </Box>
      )}
    </Box>
  );
};
