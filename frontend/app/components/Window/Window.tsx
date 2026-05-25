"use client";

import "./Window.scss";

type WindowProps = {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
};

export default function Window({
  title,
  onClose,
  children,
}: WindowProps) {
  return (
    <div className="xp-window">
      <div className="xp-window-titlebar">
        <span className="xp-window-title">
          {title}
        </span>

        <button
          className="xp-window-close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="xp-window-content">
        {children}
      </div>
    </div>
  );
}