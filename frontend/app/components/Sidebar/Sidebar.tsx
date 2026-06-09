import "./Sidebar.scss";
import DesktopIcon from "./DesktopIcon/DesktopIcon";
import { sidebarItems } from "@/app/data/navigationItems/sidebarItemsFields";


export default function Sidebar() {
  return (
    <aside className="xp-sidebar">

      {sidebarItems.map((item) => (
        <DesktopIcon
          key={item.href}
          image={item.image}
          label={item.label}
          href={item.href}
        />
      ))}

    </aside>
  );
}