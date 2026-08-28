import "../../Sidebar/DesktopIcon/DesktopIcon.scss";

type FloatingIconProps = {
  image: string;
  label: string;
  onClick: () => void;
};

export default function FloatingIcon({
  image,
  label,
  onClick,
}: FloatingIconProps) {
  return (
    <button
      className="xp-icon"
      onClick={onClick}
    >
      <img src={image} alt={label} />
      <span>{label}</span>
    </button>
  );
}