import "./globals.css";
import { Orbitron } from "next/font/google";
import Providers from "./providers"; // ✅ added this line

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Wolf St.",
  description: "Earn XP. Claim your armor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.className} bg-neutral-950 text-white min-h-screen`}
      >
        {/* ✅ Wrapped your entire app with NextAuth SessionProvider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}