"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-3">
      You logged in!
      <Button variant="outline" size="lg" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
