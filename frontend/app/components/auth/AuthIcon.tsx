import Image from "next/image";
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
      className={`xp-avatar ${className}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}