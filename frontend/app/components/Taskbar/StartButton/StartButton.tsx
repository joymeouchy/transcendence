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
      className={`xp-start ${open ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={open}
      type="button"
    >
      Start
    </button>
  );
}