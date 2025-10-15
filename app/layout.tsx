import './globals.css'
import Logo from '@/components/Logo'
import Nav from '@/components/Nav'
import { ReactNode } from 'react'

export const metadata = { title: 'Novicore Translate', description: 'Batch translation pipeline UI' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <div className="container flex items-center justify-between py-4">
            <a href="/" className="flex items-center gap-3"><Logo /></a>
            <Nav />
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
