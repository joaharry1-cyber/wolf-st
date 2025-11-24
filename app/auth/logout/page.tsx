"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-2xl mb-4">You are not signed in</h1>
        <a href="/auth/login" className="underline">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <h1 className="text-2xl mb-4">
        Signed in as {session.user?.email || session.user?.name}
      </h1>
      <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
    </div>
  );
}
