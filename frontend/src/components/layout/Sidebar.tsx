import { useNavigate, useLocation } from "react-router-dom";
import { Box, Tooltip, useMediaQuery } from "@mui/material";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const menuItems = [
  { text: "Monitoring", path: "/", icon: <SpaceDashboardRoundedIcon /> },
  { text: "Riwayat Log", path: "/logs", icon: <HistoryRoundedIcon /> },
  {
    text: "Tim & Pengaturan",
    path: "/settings",
    icon: <SettingsRoundedIcon />,
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  displayName: string;
  userEmail: string;
  initial: string;
  onLogout: () => void;
}

export default function Sidebar({
  open,
  setOpen,
  displayName,
  userEmail,
  initial,
  onLogout,
}: SidebarProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarWidth = open ? 260 : 72;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1199,
            transition: "opacity 0.3s",
          }}
        />
      )}

      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          transition: "all 0.3s var(--ease-out)",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          background: (theme) => theme.customTokens.gradients.sidebar,
          overflowX: "hidden",
          overflowY: "auto",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          ...(isMobile && !open && {
            transform: "translateX(-100%)",
          }),
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            px: open ? 2.5 : 0,
            justifyContent: open ? "space-between" : "center",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          {open && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: (theme) => theme.customTokens.gradients.logo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: (theme) => theme.customTokens.shadows.accent,
                  flexShrink: 0,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: "20px",
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  V
                </Box>
              </Box>
              <Box sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  Victie{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Monitor
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          <Box
            onClick={() => setOpen(!open)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: "rgba(255,255,255,0.5)",
              transition: "all 0.2s var(--ease-out)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#fff",
              },
            }}
          >
            {open ? (
              <MenuOpenRoundedIcon sx={{ fontSize: 20 }} />
            ) : (
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
        </Box>

        {/* Menu Items */}
        <Box
          sx={{
            flex: 1,
            py: 2,
            px: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={!open ? item.text : ""}
                placement="right"
                arrow
              >
                <Box
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setOpen(false);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: open ? 1.5 : 0,
                    px: open ? 1.5 : 0,
                    py: 1.15,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    justifyContent: open ? "flex-start" : "center",
                    position: "relative",
                    transition: "all 0.2s var(--ease-out)",
                    color: isActive ? "#fff" : (theme) => theme.customTokens.colors.sidebarText,
                    bgcolor: isActive
                      ? (theme) => theme.customTokens.colors.sidebarActive
                      : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    border: isActive
                      ? "1px solid rgba(221, 123, 141, 0.25)"
                      : "1px solid transparent",
                    // Left accent bar for active
                    "&::before": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 3,
                          height: "60%",
                          borderRadius: "0 3px 3px 0",
                          background: (theme) => theme.customTokens.gradients.activeBar,
                          boxShadow: (theme) => theme.customTokens.shadows.accent,
                        }
                      : {},
                    "&:hover": {
                      bgcolor: isActive
                        ? "rgba(221, 123, 141, 0.22)"
                        : "rgba(255,255,255,0.05)",
                      color: "#fff",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: isActive ? "primary.main" : "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </Box>
                  {open && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: "0.88rem",
                        whiteSpace: "nowrap",
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.text}
                    </Box>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* User Profile Section */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {open && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.2,
                borderRadius: "var(--radius-md)",
                bgcolor: "rgba(255,255,255,0.04)",
                mb: 0.5,
                transition: "background 0.2s",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.07)",
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: (theme) => theme.customTokens.gradients.logo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: (theme) => theme.customTokens.shadows.accent,
                }}
              >
                {initial}
              </Box>
              <Box sx={{ overflow: "hidden", flex: 1 }}>
                <Box
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.9)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayName}
                </Box>
                <Box
                  sx={{
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.35)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userEmail}
                </Box>
              </Box>
              <KeyboardArrowDownRoundedIcon
                sx={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.35)",
                  flexShrink: 0,
                }}
              />
            </Box>
          )}

          <Tooltip title={!open ? "Keluar" : ""} placement="right" arrow>
            <Box
              onClick={onLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: open ? 1.5 : 0,
                px: open ? 1.5 : 0,
                py: 1,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                justifyContent: open ? "flex-start" : "center",
                color: "#5CB8FF",
                transition: "all 0.2s var(--ease-out)",
                "&:hover": {
                  bgcolor: "rgba(92, 184, 255, 0.08)",
                  color: "#7ECAFF",
                },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              {open && (
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Keluar
                </Box>
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}
