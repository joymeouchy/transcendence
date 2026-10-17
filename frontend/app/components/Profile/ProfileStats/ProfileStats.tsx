import clsx from "clsx";
import styles from "./ProfileStats.module.scss";

const rowClass = clsx(
  styles.row,
  "flex items-center justify-between gap-xp-sm px-2.5 py-1.75 font-xp text-xp-base max-[500px]:px-2 max-[500px]:py-1.5 max-[500px]:text-xp-sm",
);


type Props = {
  wins: number;
  losses: number;
  winRate: number;
};

export default function ProfileStats({ wins, losses, winRate }: Props) {
  return (
    <div className={clsx(styles.stats, "flex w-full flex-col overflow-hidden rounded-xp-sm bg-xp-window-bg p-0")}>
  <div className={rowClass}>
    <span>Wins</span>
    <span>{wins}</span>
  </div>

  <div className={rowClass}>
    <span>Losses</span>
    <span>{losses}</span>
  </div>

  <div className={rowClass}>
    <span>Win Rate</span>
    <span>{winRate}%</span>
  </div>
</div>
  );
}
