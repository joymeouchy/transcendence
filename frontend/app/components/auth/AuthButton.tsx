import React from "react";
import "./auth.scss";

type AuthButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
};

export default function AuthButton({
  children,
  type = "button",
}: AuthButtonProps) {
  return (
    <button
      type={type}
      className="xp-submit"
    >
      {children}
    </button>
  );
}