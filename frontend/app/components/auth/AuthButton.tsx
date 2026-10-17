import React from "react";
import "./auth.scss";

type AuthButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

// Green XP "go" button used by every auth form.
export default function AuthButton({
  children,
  type = "button",
  disabled,
  onClick,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      className="xp-submit w-fit cursor-pointer rounded-xp-sm px-3.5 py-1.5 text-xp-lg font-bold text-xp-white"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
