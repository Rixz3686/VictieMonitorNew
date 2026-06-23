import { Box } from "@mui/material";
import type { IncidentEntry } from "../../types";

interface IncidentListProps {
  incidents: IncidentEntry[];
  renderTime: number;
}

export function IncidentList({ incidents, renderTime }: IncidentListProps) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <Box
        sx={{
          fontSize: "0.84rem",
          fontWeight: 600,
          color: "var(--text-heading)",
          mb: 1.5,
        }}
      >
        Recent events
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {incidents.length === 0 ? (
          <Box
            sx={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              textAlign: "center",
              py: 1,
            }}
          >
            Belum ada event tercatat.
          </Box>
        ) : (
          incidents.slice(0, 5).map((inc, i) => {
            const isStart = inc.status === "START";
            const isDown = inc.status === "DOWN";
            const isUp = inc.status === "UP";
            
            // Calculate duration if it's DOWN
            let durationText = "";
            if (isDown) {
              const downTime = new Date(inc.created_at).getTime();
              // Find next UP
              const nextUp = incidents.slice(0, i).reverse().find(x => x.status === "UP" && new Date(x.created_at).getTime() > downTime);
              const upTime = nextUp ? new Date(nextUp.created_at).getTime() : renderTime;
              const diffMs = upTime - downTime;
              
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
              
              if (hours > 0) durationText = `for ${hours} hours, ${mins} minutes`;
              else if (mins > 0) durationText = `for ${mins} minutes`;
              else durationText = `for ${secs} seconds`;
            }

            return (
              <Box key={inc.id} sx={{ display: "flex", gap: 1.5 }}>
                <Box sx={{ mt: 0.2 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${isStart ? "#3B82F6" : isUp ? "#10B981" : "#EF4444"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: isStart ? "#3B82F6" : isUp ? "#10B981" : "#EF4444",
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    {isStart && "Monitoring has started"}
                    {isUp && "Running again"}
                    {isDown && `Down ${durationText}`}
                  </Box>
                  
                  {isDown && inc.error_reason && (
                    <Box sx={{ mt: 0.5, fontSize: "0.8rem", color: "var(--text-body)" }}>
                      The reason was <Box component="span" sx={{ fontWeight: 600 }}>{inc.error_reason}</Box>.
                      {inc.error_details && (
                        <Box sx={{ mt: 0.3, color: "var(--text-subtle)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                          Details: {inc.error_details}
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  <Box
                    sx={{
                      mt: 0.5,
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {(() => {
                      const isoStr = inc.created_at.includes("T") ? inc.created_at : inc.created_at.replace(" ", "T");
                      const parsedIso = isoStr.endsWith("Z") ? isoStr : isoStr + "Z";
                      const d = new Date(parsedIso);
                      const datePart = d.toLocaleDateString("en-GB", {
                        timeZone: "Asia/Jakarta",
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      });
                      const timePart = d.toLocaleTimeString("en-GB", {
                        timeZone: "Asia/Jakarta",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      });
                      return `${datePart} · ${timePart} WIB`;
                    })()}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
