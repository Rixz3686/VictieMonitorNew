import { Box } from "@mui/material";
import StatCard from "./StatCard";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

interface StatsGridProps {
  total: number;
  upCount: number;
  downCount: number;
  avgLatency: number;
}

export const StatsGrid = ({
  total,
  upCount,
  downCount,
  avgLatency,
}: StatsGridProps) => {
  const cards = [
    {
      label: "Total Targets",
      value: total,
      icon: <StorageRoundedIcon sx={{ fontSize: 20 }} />,
      color: "#64748B",
      delay: 0,
    },
    {
      label: "Online",
      value: upCount,
      icon: <PublicRoundedIcon sx={{ fontSize: 20 }} />,
      color: "#10B981",
      delay: 80,
    },
    {
      label: "Offline",
      value: downCount,
      icon: <BlockRoundedIcon sx={{ fontSize: 20 }} />,
      color: "#EF4444",
      delay: 160,
    },
    {
      label: "Avg Latency",
      value: `${avgLatency}ms`,
      icon: <SpeedRoundedIcon sx={{ fontSize: 20 }} />,
      color: "#64748B",
      delay: 240,
    },
  ];

  return (
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
      {cards.map((card, i) => (
        <Box
          key={card.label}
          sx={{
            flex: 1,
            display: "flex",
            borderRight: {
              xs: "none",
              sm: i < cards.length - 1 ? "1px solid #F1F5F9" : "none",
            },
            borderBottom: {
              xs: i < cards.length - 1 ? "1px solid #F1F5F9" : "none",
              sm: "none",
            },
          }}
        >
          <StatCard
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            delay={card.delay}
          />
        </Box>
      ))}
    </Box>
  );
};
