import clsx from "clsx";
import "./StartButton.scss";

type StartButtonProps = {
  open: boolean;
  onClick: () => void;
};

export default function StartButton({
  open,
  onClick,
}: StartButtonProps) {
  return (
    <button
      className={clsx(
        "xp-start flex h-full cursor-pointer items-center justify-center px-4.5 py-0 font-bold text-xp-white select-none",
        open && "active",
      )}
      onClick={onClick}
      aria-pressed={open}
      type="button"
    >
      Start
    </button>
  );
}