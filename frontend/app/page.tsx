"use client";

import Link from "next/link";
import AuthLayout from "./components/auth/AuthLayout";
import AuthIcon from "./components/auth/AuthIcon";
import { useRouter } from "next/navigation";
import { images } from "@/lib/images";

import "./page.scss";

const tileClass =
  "xp-user-tile flex cursor-pointer items-center gap-xp-sm rounded-xp-sm px-xp-md py-xp-sm text-xp-white no-underline";

export default function LandingPage() {
  const router = useRouter();


  return (
    <AuthLayout>
      <div className="xp-divider h-[60vh] w-px opacity-90" />
      <div className="flex w-90 flex-col gap-xp-md">
        <div>
          <div className="mb-xp-md text-xp-md text-xp-white opacity-90"> To begin, select an option </div>
          <Link href="/login" className={tileClass}>
            <AuthIcon
              className="size-17.5"
              src= {images.loginIcon}
            />
            <div>
              <h3>Log In</h3>
              <p>Access existing account</p>
            </div> </Link>
        </div>

        <div>
          <Link href="/register" className={tileClass}>
            <AuthIcon
              className="size-17.5"
              src={images.registerIcon}
            /> <div>
              <h3>Register</h3> <p>Create new account</p>
            </div>
          </Link>
        </div>
      </div>

    </AuthLayout >
  );
}
