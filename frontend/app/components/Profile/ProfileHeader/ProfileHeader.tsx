import Image from "next/image";
import clsx from "clsx";
import styles from "./ProfileHeader.module.scss";
import { images } from "@/lib/images";

type Props = {
  username: string;
  avatarUrl: string | null;
};

export default function ProfileHeader({ username, avatarUrl }: Props) {
  return (
    <div
      className={clsx(
        styles.header,
        "flex items-center gap-xp-md rounded-xp-sm p-xp-md font-xp max-[500px]:gap-xp-sm max-[500px]:p-2.5",
      )}
    >
      <img
        src={avatarUrl || images.defaultUserIcon}
        alt="Avatar"
        width={72}
        height={72}
      />

      <div className="flex min-w-0 flex-col">
        <h1 className="m-0 truncate font-xp text-xp-2xl font-bold text-xp-ink max-[500px]:text-xp-xl">{username}</h1>
      </div>
    </div>
  );
}