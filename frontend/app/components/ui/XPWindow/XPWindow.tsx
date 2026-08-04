import "./XPWindow.scss";

type XPWindowProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  headerButton?: React.ReactNode;
};

export default function XPWindow({
  title,
  children,
  className = "",
  onClose,
  headerButton,
}: XPWindowProps) {
  return (
    <div className={`xp-window-outline ${className}`}>
      <div className="xp-window">
        <div className="xp-titlebar">
          <span className="xp-title">
            {title}
          </span>

          <div className="xp-title-actions">
            {headerButton}

            <button
              className="xp-close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="xp-content">
          {children}
        </div>
      </div>
    </div>
  );
}