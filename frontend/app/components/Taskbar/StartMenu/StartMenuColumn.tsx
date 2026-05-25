import StartMenuItem from "./StartMenuItem/StartMenuItem";

type Item = {
  image: string;
  label: string;
  href: string;
};

type Props = {
  items: Item[];
};

export default function StartMenuColumn({ items }: Props) {
  return (
    <div className="xp-start-menu-column">
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