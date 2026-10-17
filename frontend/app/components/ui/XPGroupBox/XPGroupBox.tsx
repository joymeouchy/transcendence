import clsx from "clsx";
import "./XPGroupBox.scss";

type XPGroupBoxProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

// Etched panel with a blue title strip (XP "group box").
// The title's negative margins pull it flush with the box edges.
export default function XPGroupBox({
  title,
  children,
  className,
}: XPGroupBoxProps) {
  return (
    <div
      className={clsx(
        "xp-groupbox rounded-xp-sm bg-xp-window-bg p-2.5 max-[600px]:p-2",
        className,
      )}
    >
      <div className="xp-groupbox-title -mx-2.5 -mt-2.5 mb-2.5 px-2 py-1.5 font-xp text-xp-base font-bold text-xp-white max-[600px]:-mx-2 max-[600px]:-mt-2 max-[600px]:mb-2 max-[600px]:px-1.75 max-[600px]:py-1.25 max-[600px]:text-xp-sm">
        {title}
      </div>

      {children}
    </div>
  );
}
