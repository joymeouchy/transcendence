import clsx from "clsx";
import "./XPListPanel.scss";

type XPListPanelProps = {
  title: string;
  children: React.ReactNode;
  // sizing of the outer frame (e.g. "flex-1" or "size-full")
  className?: string;
};

// Etched panel with a blue title and a white scrolling list body.
export default function XPListPanel({
  title,
  children,
  className,
}: XPListPanelProps) {
  return (
    <div
      className={clsx(
        "xp-list-panel flex min-w-0 flex-col overflow-hidden rounded-xp-sm bg-xp-window-bg text-xp-gray-900",
        className,
      )}
    >
      <div className="xp-list-panel-title shrink-0 px-2 py-1.5 font-xp text-xp-base font-bold text-xp-white">
        {title}
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-xp-white">
        {children}
      </div>
    </div>
  );
}

// Placeholder row for an empty list.
export function XPListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-xp-white px-2.5 py-3.75 text-center font-xp text-xp-sm text-xp-gray-600">
      {children}
    </div>
  );
}
