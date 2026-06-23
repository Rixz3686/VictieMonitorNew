import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "flex-end" },
      flexDirection: { xs: "column", sm: "row" },
      gap: { xs: 2, sm: 0 },
      mb: 3.5,
    }}
  >
    <Box>
      <Box
        component="h1"
        sx={{
          fontSize: { xs: "1.6rem", sm: "1.85rem" },
          fontWeight: 600,
          color: "var(--text-heading)",
          letterSpacing: "-0.3px",
          mb: 0.4,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: "0.93rem",
          color: "var(--text-muted)",
          fontWeight: 400,
        }}
      >
        {subtitle}
      </Box>
    </Box>
    {action}
  </Box>
);
