import HomeClient from "./home/HomeClient";

export const dynamic = "force-static";

export default function Page() {
  // Будь-яка логіка з токеном — вже в AuthGate (layout)
  return <HomeClient />;
}
