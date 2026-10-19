import React from "react";
import "./auth.scss";

type AuthPanelProps = {
  children: React.ReactNode;
};

export default function AuthPanel({
  children,
}: AuthPanelProps) {
  return (
    <div className="xp-login-panel w-90 max-w-full rounded-xp-md p-5 shadow-xp-window max-[400px]:p-xp-lg">
      {children}
    </div>
  );
}
