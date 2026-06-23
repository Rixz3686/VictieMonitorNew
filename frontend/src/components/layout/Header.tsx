import { useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

interface HeaderProps {
  sw: number;
  setOpen: (val: boolean) => void;
  initial: string;
}

const menuTitles: Record<string, string> = {
  "/": "Monitoring",
  "/logs": "Riwayat Log",
  "/settings": "Tim & Pengaturan",
};

export default function Header({ sw, setOpen, initial }: HeaderProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const location = useLocation();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: sw,
        right: 0,
        height: 60,
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        px: { xs: 2, sm: 4 },
        gap: 2,
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        transition: "left 0.3s var(--ease-out)",
      }}
    >
      {/* Mobile hamburger menu */}
      {isMobile && (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
            "&:hover": { bgcolor: "var(--accent-light)", color: "var(--accent)" },
            transition: "all 0.2s",
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 22 }} />
        </Box>
      )}
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="span"
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#64748B",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {menuTitles[location.pathname] || "Dashboard"}
        </Box>
        <Box
          component="span"
          sx={{
            fontSize: "0.72rem",
            color: "var(--text-subtle)",
          }}
        >
          ›
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          px: 1.5,
          py: 0.5,
          borderRadius: "var(--radius-pill)",
          bgcolor: "var(--status-up-bg)",
          border: "1px solid var(--status-up-border)",
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "var(--status-up)",
            animation: "pulseDot 2s infinite",
          }}
        />
        <Box
          component="span"
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#16A34A",
            letterSpacing: "0.02em",
            fontFamily: "'Poppins', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Live
        </Box>
      </Box>

      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { transform: "scale(1.06)" },
        }}
      >
        {initial}
      </Box>
    </Box>
  );
}
