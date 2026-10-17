// XPButton.tsx

import clsx from "clsx";
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
      className={clsx(
        "xp-button inline-flex min-w-18.75 items-center justify-center px-3 py-1 font-xp text-xp-base text-xp-text",
        className,
      )}
    >
      {children}
    </button>
  );
}