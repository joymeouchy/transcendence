import "./StartMenu.scss";
import StartMenuItem from "./StartMenuItem/StartMenuItem";

type StartMenuItemType = {
  image: string;
  label: string;
  href: string;
};

type Props = {
  items: StartMenuItemType[];
  className?: string;
};

export default function StartMenuColumn({
  items,
  className = "",
}: Props) {
  return (
    <div className={`xp-start-menu-column ${className}`}>
      {items.map((item) => (
        <StartMenuItem
          key={item.href}
          image={item.image}
          label={item.label}
          href={item.href}
        />
      ))}
    </div>
  );
}