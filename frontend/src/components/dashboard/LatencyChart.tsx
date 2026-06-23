import { Box } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { LatencyDataPoint } from "../../types";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface LatencyChartProps {
  data: LatencyDataPoint[];
  isLoading: boolean;
}

function formatTooltipValue(val: ValueType | undefined): [string, string] {
  return [`${val ?? 0}ms`, "Latensi"];
}

export function LatencyChart({ data, isLoading }: LatencyChartProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box
          sx={{
            fontSize: "0.84rem",
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Riwayat Latency (1h)
        </Box>
        {!isLoading && data.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 0.8,
              py: 0.2,
              borderRadius: "var(--radius-pill)",
              bgcolor: "var(--status-up-bg)",
              border: "1px solid var(--status-up-border)",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: "var(--status-up)",
                animation: "pulseDot 2s infinite",
              }}
            />
            <Box
              sx={{
                fontSize: "0.62rem",
                fontWeight: 600,
                color: "#059669",
              }}
            >
              LIVE
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          height: 110,
          opacity: isLoading ? 0.4 : 1,
          transition: "opacity 0.3s",
        }}
      >
        {data.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isLoading ? "Memuat data..." : "Belum ada data"}
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dpLatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-line)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-line)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                fontSize={10}
                tick={{ fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                tickMargin={4}
                stroke="#E8EAF0"
                interval="preserveStartEnd"
              />
              <YAxis
                fontSize={10}
                tick={{ fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                unit="ms"
                stroke="#E8EAF0"
                width={42}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  fontSize: "13px",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "var(--accent)", fontWeight: 700 }}
                formatter={formatTooltipValue}
                labelStyle={{
                  color: "#6B7280",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="var(--chart-line)"
                strokeWidth={2}
                fill="url(#dpLatGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--chart-line)",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
