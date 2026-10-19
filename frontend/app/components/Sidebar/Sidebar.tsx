import DesktopIcon from "./DesktopIcon/DesktopIcon";
import { sidebarItems } from "@/app/data/navigationItems/sidebarItemsFields";


export default function Sidebar() {
  // bottom padding keeps the last icons clear of the taskbar (wrapping them into a new column)
  return (
    <aside className="flex h-dvh w-40 flex-col flex-wrap content-start gap-x-4 gap-y-5 px-2.5 pt-5 pb-15 font-xp compact:contents">

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