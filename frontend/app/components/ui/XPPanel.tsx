import clsx from "clsx";
import "./XPPanel.scss";

type XPPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function XPPanel({ children, className = "" }: XPPanelProps) {
  return (
    <div
      className={clsx(
        "xp-panel rounded-xp-sm bg-xp-panel-bg p-xp-md font-xp text-xp-md text-xp-text",
        className,
      )}
    >
      {children}
    </div>
  );
}