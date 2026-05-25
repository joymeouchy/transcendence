import "./StartMenuItem.scss";
import Link from "next/link";

type StartMenuItemProps = {
  image: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
};
export default function StartMenuItem({
  image,
  label,
  href,
  onClick,
  variant = "default",
}: StartMenuItemProps) {
  const className = `xp-start-menu-item xp-start-menu-item--${variant}`;

  const content = (
    <>
      <img src={image} alt={label} />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  );
}