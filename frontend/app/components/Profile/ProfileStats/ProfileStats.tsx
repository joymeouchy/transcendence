import StatsCard from "./../StatsCard/StatsCard";
import styles from "./ProfileStats.module.scss";


type Props = {
  wins: number;
  losses: number;
  winRate: number;
};

export default function ProfileStats({ wins, losses, winRate }: Props) {
  return (
    <div className={styles.stats}>
  <div className={styles.row}>
    <span>Wins</span>
    <span>{wins}</span>
  </div>

  <div className={styles.row}>
    <span>Losses</span>
    <span>{losses}</span>
  </div>

  <div className={styles.row}>
    <span>Win Rate</span>
    <span>{winRate}%</span>
  </div>
</div>
  );
}
