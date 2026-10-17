import clsx from "clsx";
import "./XPStatusDot.scss";

type XPStatusDotProps = {
  online: boolean;
};

// Small glossy online/offline indicator used in every user list.
export default function XPStatusDot({ online }: XPStatusDotProps) {
  return (
    <span
      className={clsx(
        "xp-status-dot size-2 shrink-0 rounded-[50%]",
        online ? "bg-xp-online" : "bg-xp-offline",
      )}
    />
  );
}
