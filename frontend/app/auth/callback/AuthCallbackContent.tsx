"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackContent()
{
    const router = useRouter(); const searchParams = useSearchParams();

    useEffect(() => { 
        const token = searchParams.get("token"); const userId = searchParams.get("userId");
        if (!token)
        {
            router.replace("/login");
            return;
        }

    localStorage.setItem("token", token);

    if (userId)
    {
        localStorage.setItem("userId", userId);
    }

    router.replace("/");
    }, [router, searchParams]);

    return <div>Signing you in...</div>; 
}