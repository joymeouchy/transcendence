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

        {/* Branding */}
        <div className="xp-branding">
          <div className="xp-logo-text">
            42Beirut <br />
            <span>Pong XP</span>
          </div>
        </div>
        
        {/* Page Content */}

        {children}
        {/* <div className="xp-divider" /> */}

      </div>

      {/* Bottom Border */}
      <div className="xp-bottom-bar" />

    </div>
  );
}