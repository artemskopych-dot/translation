import AuthGate from "./components/AuthGate";

export const metadata = { title: "Novicore Translation" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
