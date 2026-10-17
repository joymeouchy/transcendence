
import clsx from "clsx";
import "./XPWindow.scss";
import XPLoader from "../XPLoader/XPLoader";

type XPWindowProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  headerButton?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
};

export default function XPWindow({
  title,
  children,
  className = "",
  onClose,
  headerButton,
  isLoading = false,
  loadingMessage = "Loading...",
}: XPWindowProps) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-xp-md bg-xp-blue p-0.5 font-xp text-xp-text shadow-xp-window",
        className,
      )}
    >
      {/* max size lets the window fit on the screen */}
      <div className="xp-window relative z-10 flex max-h-[85vh] max-w-[90vw] min-w-75 flex-col overflow-hidden bg-xp-window-bg">
        <div className="xp-titlebar flex h-8 shrink-0 items-center justify-between px-xp-sm">
          <span className="xp-title text-xp-md font-bold">
            {title}
          </span>

          <div className="flex items-center gap-1">
            {headerButton}

            <button
              className="xp-close-btn flex size-5.5 cursor-pointer items-center justify-center text-xp-sm font-bold text-xp-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* relative: lets the loading overlay cover the content */}
        <div className="xp-content relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-xp-window-bg p-xp-md text-xp-md">
          {children}

          {isLoading && (
            <XPLoader message={loadingMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
