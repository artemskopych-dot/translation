"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth_jwt")
        : null;

      // Без токена будь-яка сторінка → /login
      if (pathname !== "/login" && !token) {
        router.replace("/login");
        return;
      }
      // На /login з токеном → на головну
      if (pathname === "/login" && token) {
        router.replace("/");
        return;
      }
    } finally {
      setReady(true);
    }
  }, [pathname, router]);

  // Поки вирішуємо редірект — нічого не рендеримо
  if (!ready) return null;
  return <>{children}</>;
}
