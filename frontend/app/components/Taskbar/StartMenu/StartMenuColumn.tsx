import "./StartMenu.scss";
import StartMenuItem from "./StartMenuItem/StartMenuItem";
import DesktopCustomizationModal from "../../DesktopCustomizationModal/DesktopCustomizationModal";
import { useState } from "react";

type StartMenuItemType = {
  image: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

type Props = {
  items: StartMenuItemType[];
  className?: string;
};

export default function StartMenuColumn({
  items,
  className = "",
}: Props) {
  const [customizationOpen, setCustomizationOpen] = useState(false);
  return (
    <div className={`xp-start-menu-column ${className}`}>
      {items.map((item) => (
        <StartMenuItem
          key={item.label}
          image={item.image}
          label={item.label}
          href={item.href}
          onClick={
            item.label === "Customize"
              ? () => setCustomizationOpen(true)
              : undefined
          }
        />
      ))}
      <DesktopCustomizationModal
        isOpen={customizationOpen}
        onClose={() => setCustomizationOpen(false)}
      />
    </div>
  );
}