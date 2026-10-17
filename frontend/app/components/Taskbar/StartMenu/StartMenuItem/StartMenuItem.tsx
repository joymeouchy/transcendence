import clsx from "clsx";
import "./StartMenuItem.scss";
import Link from "next/link";

type StartMenuItemProps = {
  image: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
};

// Spacing/color per variant; hover states live in StartMenuItem.scss.
const variantClasses = {
  default: "gap-2 px-2 py-1.5 text-xp-text",
  danger: "gap-px p-0 text-xp-white",
} as const;

export default function StartMenuItem({
  image,
  label,
  href,
  onClick,
  variant = "default",
}: StartMenuItemProps) {
  const className = clsx(
    "xp-start-menu-item flex cursor-pointer items-center no-underline select-none",
    `xp-start-menu-item--${variant}`,
    variantClasses[variant],
  );

  const content = (
    <>
      <img src={image} alt={label} className="size-5 object-contain" />
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
