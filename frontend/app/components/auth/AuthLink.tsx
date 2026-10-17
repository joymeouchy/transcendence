import React from "react";
import Link from "next/link";
import clsx from "clsx";

type AuthLinkProps = React.ComponentProps<typeof Link>;

// Secondary navigation link under an auth form ("Forgot password?" ...).
export default function AuthLink({ className, ...props }: AuthLinkProps) {
  return (
    <Link
      {...props}
      className={clsx("xp-link mt-2.5 block text-xp-lg text-xp-white opacity-80", className)}
    />
  );
}
