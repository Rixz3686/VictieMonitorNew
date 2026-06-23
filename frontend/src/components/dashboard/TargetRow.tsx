import { memo } from "react";
import { Box, Chip, IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import type { Target } from "../../types";

interface TargetRowProps {
  target: Target;
  index: number;
  isSelected: boolean;
  onSelect: (target: Target) => void;
  onEdit: (target: Target) => void;
  onDelete: (id: string) => void;
}

const TargetRow = memo(
  ({ target, index, isSelected, onSelect, onEdit, onDelete }: TargetRowProps) => {
    const isUp = target.current_status === "UP";
    const isDown = target.current_status === "DOWN";

    return (
      <Box
        onClick={() => onSelect(target)}
        sx={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr 0.8fr 1fr 90px",
          minWidth: 700,
          px: 2.5,
          py: 1.5,
          alignItems: "center",
          borderBottom: "1px solid var(--border-light)",
          cursor: "pointer",
          transition: "all 0.18s var(--ease-out)",
          animation: `fadeInUp 0.4s var(--ease-out) ${index * 50}ms both`,
          bgcolor: isSelected ? "#F1F5F9" : "transparent",
          outline: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
          outlineOffset: "-2px",
          borderRadius: isSelected ? "12px" : 0,
          "&:hover": {
            bgcolor: isSelected ? "#F1F5F9" : "#F8FAFC",
          },
          "&:last-child": { borderBottom: "none" },
        }}
      >
        <Box sx={{ fontWeight: 600, color: "#111827", fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>
          {target.name}
        </Box>

        <Box sx={{ color: "#64748B", fontSize: "14px", fontWeight: 400, fontFamily: "'JetBrains Mono', monospace" }}>
          {target.host}{target.port ? `:${target.port}` : ""}
        </Box>

        <Box sx={{ fontSize: "14px", color: "#334155", fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
          {target.protocol}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Chip
            label={
              isUp
                ? `UP - ${target.latency_ms || 0}ms`
                : isDown
                  ? "DOWN"
                  : "CHECKING..."
            }
            size="small"
            sx={{
              borderRadius: "var(--radius-pill)",
              bgcolor: isUp
                ? "var(--status-up-bg)"
                : isDown
                  ? "var(--status-down-bg)"
                  : "#F3F4F6",
              color: isUp ? "#059669" : isDown ? "#DC2626" : "#9CA3AF",
              border: `1px solid ${
                isUp
                  ? "var(--status-up-border)"
                  : isDown
                    ? "var(--status-down-border)"
                    : "#E5E7EB"
              }`,
              "& .MuiChip-label": { px: 1.2 },
            }}
          />
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            sx={{
              color: "var(--text-subtle)",
              borderRadius: "var(--radius-sm)",
              "&:hover": { color: "var(--accent)", bgcolor: "var(--accent-light)" },
            }}
            onClick={() => onEdit(target)}
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "var(--text-subtle)",
              borderRadius: "var(--radius-sm)",
              "&:hover": { color: "#EF4444", bgcolor: "#FEE2E2" },
            }}
            onClick={() => onDelete(target.id)}
          >
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.target.current_status === nextProps.target.current_status &&
    prevProps.target.latency_ms === nextProps.target.latency_ms &&
    prevProps.target.name === nextProps.target.name &&
    prevProps.target.host === nextProps.target.host &&
    prevProps.target.port === nextProps.target.port &&
    prevProps.target.protocol === nextProps.target.protocol,
);

export default TargetRow;
