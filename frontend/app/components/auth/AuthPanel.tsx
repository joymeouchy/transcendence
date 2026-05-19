import React from "react";
import "./auth.scss";

type AuthPanelProps = {
  children: React.ReactNode;
};

export default function AuthPanel({
  children,
}: AuthPanelProps) {
  return (
    <div className="xp-login-panel">
      {children}
    </div>
  );
}