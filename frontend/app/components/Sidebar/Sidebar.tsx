import DesktopIcon from "./DesktopIcon/DesktopIcon";
import { sidebarItems } from "@/app/data/navigationItems/sidebarItemsFields";


export default function Sidebar() {
  return (
    <aside className="flex h-screen w-40 flex-col flex-wrap content-start gap-x-4 gap-y-5 px-2.5 py-5 font-xp">

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