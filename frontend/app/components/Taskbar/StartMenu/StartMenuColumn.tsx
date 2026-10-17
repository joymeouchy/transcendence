import StartMenuItem from "./StartMenuItem/StartMenuItem";
import DesktopCustomizationModal from "../../DesktopCustomizationModal/DesktopCustomizationModal";
import { useState } from "react";
import clsx from "clsx";

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
    <div className={clsx("flex min-w-0 flex-1 flex-col gap-1.5", className)}>
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