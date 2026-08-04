// XPModal.tsx

import XPWindow from "./../XPWindow/XPWindow";

import "./XPModal.scss";

type XPModalProps = {
  title: string;
  children: React.ReactNode;

  isOpen: boolean;

  onClose?: () => void;

  className?: string;

  headerButton?: React.ReactNode;
};

export default function XPModal({
  title,
  children,
  isOpen,
  onClose,
  className = "",
  headerButton,
}: XPModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="xp-modal-overlay"
      onClick={() => onClose?.()}
    >
      <div
        className="xp-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <XPWindow
          title={title}
          onClose={onClose}
          className={className}
          headerButton={headerButton}
        >
          {children}
        </XPWindow>
      </div>
    </div>
  );
}