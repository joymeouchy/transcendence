import Image from "next/image";
import clsx from "clsx";
import "./auth.scss";

type AuthIconProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function AuthIcon({
  src,
  alt = "Avatar",
  width = 64,
  height = 65,
  className = "",
}: AuthIconProps) {
  return (
    <Image
      className={clsx("xp-avatar rounded-xp-sm object-cover", className)}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
