import clsx from "clsx";
import "./XPCard.scss";

type XPCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  // extra classes for the title pill (e.g. responsive padding)
  titleClassName?: string;
};

// Floating stats card with an optional blue title pill.
export default function XPCard({
  title,
  children,
  className,
  titleClassName,
}: XPCardProps) {
  return (
    <div
      className={clsx(
        "xp-card w-full rounded-xp-sm bg-xp-window-bg p-xp-sm shadow-xp-window",
        className,
      )}
    >
      {title && (
        <div
          className={clsx(
            "xp-card-title mb-xp-sm rounded-xp-sm px-2 py-1.25 text-xp-base font-bold text-xp-white",
            titleClassName,
          )}
        >
          {title}
        </div>
      )}

      {children}
    </div>
  );
}
