import StatsCard from "./../StatsCard/StatsCard";
import styles from "./ProfileStats.module.scss";


type Props = {
  wins: number;
  losses: number;
  winRate: number;
};

export default function ProfileStats({ wins, losses, winRate }: Props) {
  return (
    <div className={styles.grid}>
    <StatsCard label="Wins" value={wins} colorClass={styles.valueGreen} />
    <StatsCard label="Losses" value={losses} colorClass={styles.valueRed} />
    <StatsCard label="Win Rate" value={`${winRate}%`} colorClass={styles.valueBlue} />
    </div>
  );
}