import { Box, Tooltip as MuiTooltip } from "@mui/material";
import type { UptimeStatus } from "../../types";

const UPTIME_BAR_LABELS: Record<UptimeStatus, string> = {
  UP: "Online",
  DOWN: "Offline",
  NODATA: "Belum ada data",
};

const UPTIME_BAR_COLORS: Record<UptimeStatus, string> = {
  UP: "var(--status-up)",
  DOWN: "var(--status-down)",
  NODATA: "var(--border)",
};

const UPTIME_BAR_OPACITY: Record<UptimeStatus, number> = {
  UP: 0.65,
  DOWN: 0.9,
  NODATA: 0.4,
};

interface UptimeBarsProps {
  bars: UptimeStatus[];
}

export function UptimeBars({ bars }: UptimeBarsProps) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <Box
        sx={{
          fontSize: "0.84rem",
          fontWeight: 600,
          color: "var(--text-heading)",
          mb: 1,
        }}
      >
        Riwayat Uptime (24h)
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: "1.5px",
          height: 38,
        }}
      >
        {bars.map((status, i) => (
          <MuiTooltip
            key={i}
            title={UPTIME_BAR_LABELS[status]}
            arrow
            placement="top"
          >
            <Box
              sx={{
                flex: 1,
                height: "100%",
                bgcolor: UPTIME_BAR_COLORS[status],
                borderRadius: "1.5px",
                opacity: UPTIME_BAR_OPACITY[status],
                animation: `barGrow 0.4s var(--ease-out) ${i * 12}ms both`,
                transformOrigin: "bottom",
                transition: "opacity 0.2s, transform 0.15s",
                cursor: "pointer",
                "&:hover": {
                  opacity: 1,
                  transform: "scaleY(1.15)",
                },
              }}
            />
          </MuiTooltip>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.5,
        }}
      >
        <Box
          sx={{
            fontSize: "0.68rem",
            color: "var(--text-subtle)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          24h lalu
        </Box>
        <Box
          sx={{
            fontSize: "0.68rem",
            color: "var(--text-subtle)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Sekarang
        </Box>
      </Box>
    </Box>
  );
}
