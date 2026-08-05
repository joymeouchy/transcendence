import React from "react";
import "./auth.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="xp-screen">
      <div className="xp-login-center">
        <div className="xp-branding">
          <div className="xp-logo-text">
            <span>Pong XP</span>
          </div>
        </div>
        {children}
      </div>
      <div className="xp-bottom-bar" />
    </div>
  );
}