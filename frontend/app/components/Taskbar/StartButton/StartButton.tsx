import "./StartButton.scss"

type StartButtonProps = {
  open: boolean;
  onClick: () => void;
};

export default function StartButton({
  open,
  onClick,
}: StartButtonProps) {
  return (
    <div
      className={`xp-start ${open ? "active" : ""}`}
      onClick={onClick}
    >
      Start
    </div>
  );
}