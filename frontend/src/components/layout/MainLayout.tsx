import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // On mobile: sidebar overlays content (sw=0 ensures no margin push)
  // On desktop: sidebar pushes content via margin
  const open = sidebarOpen;
  const setOpen = useCallback((val: boolean) => setSidebarOpen(val), []);

  const userEmail = user?.email || "Tamu";
  const rawName = userEmail.split("@")[0];
  const displayName = rawName.replace(/^./, (s: string) => s.toUpperCase());
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // On mobile, sidebar is overlay (no margin push)
  const sw = isMobile ? 0 : open ? 260 : 72;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "var(--bg-base)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar
        open={open}
        setOpen={setOpen}
        displayName={displayName}
        userEmail={userEmail}
        initial={initial}
        onLogout={handleLogout}
      />

      <Header sw={sw} setOpen={setOpen} initial={initial} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sw}px`,
          mt: "60px",
          width: `calc(100% - ${sw}px)`,
          maxWidth: `calc(100vw - ${sw}px)`,
          minHeight: "calc(100vh - 60px)",
          transition: "margin-left 0.3s var(--ease-out), width 0.3s var(--ease-out)",
          bgcolor: "var(--bg-base)",
          p: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
