"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_jwt");
    if (pathname !== "/login" && !token) {
      router.replace("/login"); return;
    }
    if (pathname === "/login" && token) {
      router.replace("/"); return;
    }
  }, [pathname, router]);

  // ЖОДНОГО хедера тут. Хедер малюємо лише на головній сторінці (після логіну).
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
