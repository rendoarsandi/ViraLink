"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If session loading is complete and there's no session, redirect.
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // While session is loading, or if there's no session (before redirect kicks in), show loading.
  if (isPending || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  // If session exists, render the children.
  return <>{children}</>;
}
