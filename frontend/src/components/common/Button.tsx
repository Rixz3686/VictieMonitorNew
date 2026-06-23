import { useState } from "react";
import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";
import { BUTTON_STYLES } from "../../utils/constants";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  style?: CSSProperties;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onClick,
  variant = "primary",
  icon,
  style,
  fullWidth = false,
  disabled = false,
  type = "button",
  ...rest
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);

  const baseStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "10px 24px",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s var(--ease-out)",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : undefined,
    ...BUTTON_STYLES[variant],
    ...(hovered && !disabled && variant === "primary"
      ? {
          transform: "translateY(-1px)",
          boxShadow: "0 6px 8px -1px rgba(255, 178, 190, 0.25)",
        }
      : {}),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
