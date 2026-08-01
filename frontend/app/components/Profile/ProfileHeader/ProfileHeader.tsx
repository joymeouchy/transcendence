import Image from "next/image";
import styles from "./ProfileHeader.module.scss";
import { images } from "@/lib/images";

type Props = {
  username: string;
  avatarUrl: string | null;
};

export default function ProfileHeader({ username, avatarUrl }: Props) {
  return (
    <div className={styles.header}>
      <Image
        src={avatarUrl ?? images.defaultUserIcon}
        alt="Avatar"
        width={72}
        height={72}
        unoptimized
      />

      <div className={styles.info}>
        <h1 className={styles.username}>{username}</h1>
      </div>
    </div>
  );
}