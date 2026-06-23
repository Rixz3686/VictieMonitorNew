import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useAuth } from "../context/AuthContext";
import { useTeams } from "../hooks/useTeams";
import { Button } from "../components/common/Button";
import { PageHeader } from "../components/common/PageHeader";
import CreateTeamDialog from "../components/settings/CreateTeamDialog";
import DeleteTeamDialog from "../components/settings/DeleteTeamDialog";

const CARD_SX = {
  bgcolor: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
} as const;

const FEATURES = [
  {
    title: "Real-time Monitoring",
    desc: "Pemantauan berjalan di backend, melacak status target setiap interval yang ditentukan.",
  },
  {
    title: "Log Insiden",
    desc: "Setiap perubahan status UP/DOWN dicatat otomatis untuk audit dan analisis.",
  },
  {
    title: "Grafik Latensi",
    desc: "Pantau tren latensi server dari waktu ke waktu dengan grafik area interaktif.",
  },
] as const;

export default function Settings() {
  const { activeTeamId, setActiveTeam } = useAuth();
  const { teams, invalidateTeams, invalidateTargets } = useTeams();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTeamId && teams.length > 0) {
      setActiveTeam(teams[0].id);
    }
  }, [teams, activeTeamId, setActiveTeam]);

  const handleTeamCreated = (teamId: string) => {
    setActiveTeam(teamId);
    invalidateTeams();
  };

  const handleTeamDeleted = () => {
    if (deleteTeamId === activeTeamId) {
      const remaining = teams.filter((t) => t.id !== deleteTeamId);
      setActiveTeam(remaining.length > 0 ? remaining[0].id : null);
    }
    invalidateTeams();
    invalidateTargets();
    setDeleteTeamId(null);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", animation: "fadeInUp 0.45s ease" }}>
      <PageHeader
        title="Pengaturan"
        subtitle="Kelola ruang kerja dan tim monitoringmu di sini"
        action={
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            icon={<AddIcon sx={{ fontSize: 18 }} />}
          >
            Buat Tim
          </Button>
        }
      />

      <Box sx={{ ...CARD_SX, p: 4, mb: 3 }}>
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--text-heading)",
            mb: 0.75,
          }}
        >
          Tim Saya
        </Box>
        <Box
          sx={{
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            fontWeight: 400,
            mb: 4,
          }}
        >
          Pilih tim yang aktif. Dashboard akan menampilkan target sesuai tim
          yang dipilih.
        </Box>

        {teams.length > 0 ? (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1.5 }}>
            {teams.map((team) => {
              const isActive = team.id === activeTeamId;
              return (
                <Box
                  key={team.id}
                  onClick={() => setActiveTeam(team.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2.5,
                    py: 1.75,
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: isActive
                      ? "2px solid var(--accent)"
                      : "1px solid #E2E8F0",
                    bgcolor: isActive ? "#F1F5F9" : "#FFFFFF",
                    boxShadow: isActive
                      ? "0 4px 6px -1px rgba(221, 123, 141, 0.1)"
                      : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    "&:hover": {
                      border: isActive ? "2px solid var(--accent)" : "1px solid var(--accent)",
                      bgcolor: isActive ? "#F1F5F9" : "#F8FAFC",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {isActive && (
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 18, color: "var(--accent)", flexShrink: 0 }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: isActive
                        ? "var(--accent)"
                        : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: isActive ? "#fff" : "#9ca3af",
                      flexShrink: 0,
                    }}
                  >
                    {team.name.charAt(0).toUpperCase()}
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "0.9rem",
                        color: isActive
                          ? "var(--text-heading)"
                          : "var(--text-muted)",
                      }}
                    >
                      {team.name}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "12px", color: isActive ? "var(--accent)" : "#94A3B8",
                      }}
                    >
                      {isActive ? "Aktif" : "Klik untuk pilih"}
                    </Box>
                  </Box>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTeamId(team.id);
                    }}
                    sx={{
                      ml: "auto",
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-subtle)",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(220, 38, 38, 0.1)",
                        color: "#DC2626",
                      },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              p: 4,
              borderRadius: "14px",
              bgcolor: "rgba(221, 123, 141, 0.05)",
              border: "2px dashed rgba(221, 123, 141, 0.3)",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <Box sx={{ fontSize: "2rem", mb: 1 }}>🏗️</Box>
            <Box
              sx={{ fontWeight: 600, color: "var(--text-heading)", mb: 0.5 }}
            >
              Belum ada tim
            </Box>
            <Box sx={{ fontSize: "0.875rem" }}>
              Buat tim pertamamu dengan mengklik tombol{" "}
              <Box component="span" sx={{ color: "var(--accent)", fontWeight: 600 }}>
                Buat Tim
              </Box>{" "}
              di atas.
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ ...CARD_SX, p: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
        {FEATURES.map(({ title, desc }) => (
          <Box key={title} sx={{ flex: "1 1 220px" }}>
            <Box sx={{ fontSize: "1.4rem", mb: 1 }}></Box>
            <Box
              sx={{
                fontWeight: 600,
                color: "var(--text-heading)",
                mb: 0.5,
                fontSize: "0.95rem",
              }}
            >
              {title}
            </Box>
            <Box
              sx={{
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {desc}
            </Box>
          </Box>
        ))}
      </Box>

      <CreateTeamDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onTeamCreated={handleTeamCreated}
      />

      <DeleteTeamDialog
        open={!!deleteTeamId}
        onClose={() => setDeleteTeamId(null)}
        teamId={deleteTeamId}
        teamName={teams.find((t) => t.id === deleteTeamId)?.name ?? ""}
        onDeleted={handleTeamDeleted}
      />
    </Box>
  );
}
