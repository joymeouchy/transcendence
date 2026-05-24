import "./Sidebar.scss";
import DesktopIcon from "../DesktopIcon/DesktopIcon";

export default function Sidebar() {
  return (
    <aside className="xp-sidebar">

      <DesktopIcon
        image="/home.ico"
        label="Home"
        href="/home"
      />

      <DesktopIcon
        image="/user.ico"
        label="My Profile"
        href="/profile"
      />

      <DesktopIcon
        image="/game.ico"
        label="Play"
        href="/game"
      />

    </aside>
  );
}