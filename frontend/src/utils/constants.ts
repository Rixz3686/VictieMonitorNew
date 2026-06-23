export const PROTOCOLS = [
  { value: "HTTP", label: "HTTP" },
  { value: "HTTPS", label: "HTTPS" },
  { value: "TCP", label: "TCP" },
  { value: "ICMP", label: "ICMP (Ping)" },
];

export const INPUT_STYLES = {
  base: {
    width: "100%",
    padding: "11px 14px",
    background: "var(--bg-base)",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-heading)",
    fontSize: "0.9rem",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  focus: {
    borderColor: "var(--accent-light-solid)",
    boxShadow: "0 0 0 3px var(--accent-glow)",
  },
};

export const BUTTON_STYLES = {
  primary: {
    background: "var(--accent-light-solid)",
    color: "#FFFFFF",
    boxShadow: "0 4px 6px -1px rgba(255, 178, 190, 0.2)",
  },
  danger: {
    background: "#DC2626",
    color: "#FFFFFF",
    boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.2)",
  },
  secondary: {
    background: "var(--bg-surface)",
    color: "var(--text-body)",
    border: "1px solid var(--border)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
};
