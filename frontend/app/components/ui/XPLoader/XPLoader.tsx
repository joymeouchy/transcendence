
import clsx from "clsx";
import styles from "./XPLoader.module.scss";

type XPLoaderProps = {
  message?: string;
  className?: string;
};

export default function XPLoader({
  message = "Loading...",
  className = "",
}: XPLoaderProps) {
  return (
    <div
      className={clsx(
        "absolute inset-0 z-1 flex flex-col items-center justify-center gap-4 bg-xp-classic-face font-xp text-xp-md text-xp-black",
        className,
      )}
    >
      <p className="m-0">{message}</p>

      <div className={clsx(styles.progressBar, "h-4 w-45 overflow-hidden p-0.5")}>
        <div className={clsx(styles.progress, "h-full w-[40%]")} />
      </div>
    </div>
  );
}
