
import XPWindow from "./../XPWindow/XPWindow";

import "./XPModal.scss";

type XPModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  headerButton?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
};

export default function XPModal({
  title,
  children,
  isOpen,
  onClose,
  className = "",
  headerButton,
  isLoading = false,
  loadingMessage = "Loading...",
}: XPModalProps) {
  if (!isOpen) return null;

  return (
    <div
      // XPWindow is at least 300px wide: keep the side gutter small on phones
      className="xp-modal-overlay fixed inset-0 z-9999 flex items-center justify-center p-xp-sm sm:p-xp-lg"
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
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        >
          {children}
        </XPWindow>
      </div>
    </div>
  );
}
