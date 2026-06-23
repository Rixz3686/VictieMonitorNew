import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: ReactNode;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <Box
    sx={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      gap: 2,
      animation: "fadeInUp 0.45s var(--ease-out)",
    }}
  >
    <Box sx={{ fontSize: "3rem" }}>{icon}</Box>
    <Box
      sx={{
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "var(--text-heading)",
      }}
    >
      {title}
    </Box>
    {description && (
      <Box sx={{ fontSize: "0.875rem", textAlign: "center" }}>
        {description}
      </Box>
    )}
  </Box>
);
