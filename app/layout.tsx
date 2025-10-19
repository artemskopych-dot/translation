"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_jwt");
    // якщо НЕ на /login і немає токена → на логін
    if (pathname !== "/login" && !token) {
      router.replace("/login");
      return;
    }
    // якщо на /login і токен вже є → на головну
    if (pathname === "/login" && token) {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  // жодного header тут — він є тільки на домашній сторінці
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
