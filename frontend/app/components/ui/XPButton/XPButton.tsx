// XPButton.tsx

import "./XPButton.scss";

type XPButtonProps = {
  children: React.ReactNode;

  onClick?: () => void;

  type?: "button" | "submit" | "reset";

  disabled?: boolean;

  className?: string;
};

export default function XPButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: XPButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`xp-button ${className}`}
    >
      {children}
    </button>
  );
}