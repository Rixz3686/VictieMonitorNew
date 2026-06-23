import { useState } from "react";
import { INPUT_STYLES } from "../../utils/constants";

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  min?: number;
}

export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    ...INPUT_STYLES.base,
    ...(focused ? INPUT_STYLES.focus : {}),
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...(min !== undefined ? { min } : {})}
      />
    </div>
  );
};
