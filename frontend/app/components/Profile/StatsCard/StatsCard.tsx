import styles from "./StatsCard.module.scss";

type Props = {
  label: string;
  value: number | string;
  colorClass?: string;
};

export default function StatsCard({ label, value, colorClass }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={`${styles.value} ${colorClass}`}>
      {value}
      </p>
    </div>
  );
}