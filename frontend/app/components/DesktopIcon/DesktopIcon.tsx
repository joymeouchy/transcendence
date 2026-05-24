import Link from "next/link";
import "./DesktopIcon.scss";

type DesktopIconProps = {
  image: string;
  label: string;
  href: string;
};

export default function DesktopIcon({
  image,
  label,
  href,
}: DesktopIconProps) {
  return (
    <Link
      href={href}
      className="xp-icon"
    >
      <img
        src={image}
        alt={label}
      />

      <span>{label}</span>
    </Link>
  );
}