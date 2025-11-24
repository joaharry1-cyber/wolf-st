"use client";
import { signOut, useSession } from "next-auth/react";

export default function LogoutPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Logout Page</h1>
      {session && (
        <button
          onClick={() => signOut()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Sign Out
        </button>
      )}
    </div>
  );
}