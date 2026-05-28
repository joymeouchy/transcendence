import Image from "next/image";
import styles from "./ProfileHeader.module.scss";
import { images } from "@/lib/images";

type Props = {
  username: string;
  tagline: string;
};

export default function ProfileHeader({ username, tagline }: Props) {
  return (
    <div className={styles.header}>
      <Image
        src={images.defaultUserIcon}
        alt="Avatar"
        width={72}
        height={72}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <h1 className={styles.username}>{username}</h1>
        <p className={styles.tagline}>{tagline}</p>
      </div>
    </div>
  );
}