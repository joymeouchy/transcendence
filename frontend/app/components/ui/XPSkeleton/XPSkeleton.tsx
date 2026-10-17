import clsx from "clsx";
import "./XPSkeleton.scss";

type XPSkeletonProps = {
  // size, radius and spacing of the placeholder, as Tailwind classes
  className?: string;
  as?: "span" | "div";
};

// Shimmering loading placeholder.
export default function XPSkeleton({ className, as: Tag = "span" }: XPSkeletonProps) {
  return <Tag className={clsx("xp-skeleton block", className)} />;
}
