import React from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useTargetHistory } from "../../hooks/useTargetHistory";
import type { Target } from "../../types";

import { LatencyChart } from "./LatencyChart";
import { UptimeBars } from "./UptimeBars";
import { IncidentList } from "./IncidentList";
import { TargetActions } from "./TargetActions";

interface DetailPanelProps {
  target: Target;
  activeTeamId: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function DetailPanel({
  target,
  activeTeamId,
  onEdit,
  onDelete,
  onClose,
}: DetailPanelProps) {
  const [renderTime] = React.useState(() => Date.now());

  const {
    latencyData,
    uptimeBars,
    avgLatency,
    lastIncident,
    incidents,
    isLoading,
  } = useTargetHistory(activeTeamId, target.id);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 330 },
        minWidth: { xs: "auto", md: 330 },
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: (theme) => `1px solid ${theme.customTokens.colors.borderLight}`,
        boxShadow: (theme) => theme.customTokens.shadows.cardHover,
        overflow: "hidden",
        animation: "slideInRight 0.35s var(--ease-out) both",
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "0.92rem",
            color: "var(--text-heading)",
          }}
        >
          Detail Target: {target.name}
        </Box>
        <Box
          onClick={onClose}
          sx={{
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            "&:hover": { color: "var(--text-heading)" },
            transition: "color 0.2s",
          }}
        >
          <KeyboardArrowUpRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
        }}
      >
        <Box
          sx={{
            fontSize: "0.84rem",
            color: "var(--text-body)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Insiden Terakhir:{" "}
          <Box component="span" sx={{ fontWeight: 500 }}>
            {lastIncident ?? "Tidak ada"}
          </Box>
        </Box>

        {avgLatency != null && (
          <Box
            sx={{
              fontSize: "0.84rem",
              color: "var(--text-body)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Rata-rata Latensi:{" "}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "var(--accent)" }}
            >
              {avgLatency}ms
            </Box>
          </Box>
        )}
      </Box>

      <LatencyChart data={latencyData} isLoading={isLoading} />
      <UptimeBars bars={uptimeBars} />
      <IncidentList incidents={incidents} renderTime={renderTime} />
      <TargetActions onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
}
