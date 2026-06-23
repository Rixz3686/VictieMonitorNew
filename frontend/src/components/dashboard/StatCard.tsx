import { Box } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 2,
        px: 2.5,
        animation: `fadeInUp 0.5s var(--ease-out) ${delay}ms both`,
        cursor: "default",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "20%",
          left: 0,
          width: "3px",
          height: "60%",
          borderRadius: "0 3px 3px 0",
          bgcolor: color,
          opacity: 0.7,
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: `${color}12`,
            border: `1px solid ${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            flexShrink: 0,
            transition: "all 0.25s var(--ease-out)",
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Box
          sx={{
            fontSize: "11px",
            color: "#94A3B8",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 0.3,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#111827",
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Box>
      </Box>
    </Box>
  );
}
