import { useState } from "react";
import { INPUT_STYLES } from "../../utils/constants";

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const Select = ({ label, value, onChange, options }: SelectProps) => {
  const [focused, setFocused] = useState(false);

  const selectStyle = {
    ...INPUT_STYLES.base,
    ...(focused ? INPUT_STYLES.focus : {}),
    cursor: "pointer",
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "#334155",
          marginBottom: 4,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
