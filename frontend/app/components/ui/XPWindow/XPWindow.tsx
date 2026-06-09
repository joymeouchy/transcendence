// XPWindow.tsx

import "./XPWindow.scss";

type XPWindowProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export default function XPWindow({
  title,
  children,
  className = "",
  onClose,
}: XPWindowProps) {
  return (
    <div className={`xp-window-outline ${className}`}>
      <div className="xp-window">
        <div className="xp-titlebar">
          <span className="xp-title">{title}</span>

          <button
            className="xp-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="xp-content">
          {children}
        </div>
      </div>
    </div>
  );
}