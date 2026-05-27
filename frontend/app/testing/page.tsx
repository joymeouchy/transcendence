import XPWindow from "../components/ui/XPWindow/XPWindow";
import { images } from "@/lib/images";

export default function TestPage() {
  return (
    <div
      style={{
        background: images.windowsDefaultWallpaper,
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <XPWindow title="Pong.exe">
        <p>Hello from the XP window.</p>

        <button>Test Button</button>
      </XPWindow>
    </div>
  );
}