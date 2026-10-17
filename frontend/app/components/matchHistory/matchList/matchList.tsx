import clsx from "clsx";
import { useRouter } from "next/navigation";
import { MatchHistory } from "@/services/user.services";
import { MatchFilter } from "../matchHistory";
import styles from "./matchList.module.scss";

interface Props {
  matches: MatchHistory[];
  filter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
}

const resultColor = {
  win: "text-xp-win",
  loss: "text-xp-danger",
  draw: "text-xp-gray-600",
} as const;

const avatarClass =
  "size-7.5 shrink-0 rounded-xp-sm border border-xp-border-dark object-cover max-[420px]:size-6.5";

export default function MatchList({ matches, filter, onFilterChange }: Props) {
  const router = useRouter();
  const filters: MatchFilter[] = ["all", "win", "loss"];

  return (
    <div className={clsx(styles.section, "flex size-full max-h-80 min-h-0 flex-col overflow-hidden rounded-xp-sm bg-xp-window-bg shadow-xp-window")}>
      <div className={clsx(styles.header, "flex shrink-0 items-center justify-between gap-xp-sm px-2 py-1.5 max-[600px]:flex-col max-[600px]:items-start")}>
        <div className={clsx(styles.sectionTitle, "font-xp text-xp-base font-bold whitespace-nowrap text-xp-white")}>MATCH HISTORY</div>
        <div className="flex shrink-0 gap-0.75 max-[600px]:w-full">
          {filters.map((value) => (
            <button
              key={value}
              className={clsx(
                styles.filter,
                filter === value && styles.active,
                "px-2 py-1 font-xp text-xp-xs max-[600px]:flex-1",
                filter === value ? "text-xp-white" : "text-xp-ink",
              )}
              onClick={() => onFilterChange(value)}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={clsx(styles.list, "min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-xp-white")}>
        {matches.length === 0 ? (
          <div className="bg-xp-white px-2.5 py-7.5 text-center font-xp text-xp-sm text-xp-gray-600">No matches found.</div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className={clsx(
                styles.row,
                "grid min-h-11.5 cursor-pointer grid-cols-[minmax(140px,1fr)_70px_60px_90px] items-center px-2 py-1.25 font-xp text-xp-sm text-xp-gray-900",
                "max-[600px]:grid-cols-[minmax(120px,1fr)_55px_50px_75px] max-[600px]:text-xp-xs",
                "max-[420px]:grid-cols-[minmax(100px,1fr)_50px_45px_65px] max-[420px]:px-1.5",
              )}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/profile/${match.opponent.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/profile/${match.opponent.id}`);
                }
              }}
            >
              <div className="flex min-w-0 items-center gap-2 max-[420px]:gap-1.25">
                {match.opponent.avatarUrl ? (
                  <img src={match.opponent.avatarUrl} alt="" className={avatarClass} />
                ) : (
                  <div className={clsx(styles.placeholder, avatarClass, "flex items-center justify-center text-xp-lg font-bold text-xp-white")}>
                    {match.opponent.username[0]}
                  </div>
                )}
                <span className="min-w-0 truncate font-bold">{match.opponent.username}</span>
              </div>

              <div className="text-center font-bold whitespace-nowrap text-xp-gray-800">
                {match.myScore} - {match.opponentScore}
              </div>

              <div className={clsx("text-center font-bold", resultColor[match.result])}>
                {match.result.toUpperCase()}
              </div>

              <div className="text-right whitespace-nowrap text-xp-gray-600 max-[420px]:text-xp-2xs">
                {new Date(match.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
