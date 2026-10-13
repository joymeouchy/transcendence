
import styles from "./XPLoader.module.scss";

type XPLoaderProps = {
  message?: string;
  className?: string;
};

export default function XPLoader({
  message = "Loading...",
  className = "",
}: XPLoaderProps) {
  return (
    <div className={`${styles.loading} ${className}`}>
      <p>{message}</p>

      <div className={styles.progressBar}>
        <div className={styles.progress} />
      </div>
    </div>
  );
}
