'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Nav() {
  const pathname = usePathname();
  const isTranslation = pathname?.startsWith('/translation') || pathname === '/';
  const isReview = pathname?.startsWith('/review') || pathname?.startsWith('/jobs');

  return (
    <nav className="flex items-center gap-6">
      <Link className={clsx('navlink', isTranslation && 'navlink-active')} href="/translation">Translation</Link>
      <Link className={clsx('navlink', isReview && 'navlink-active')} href="/review">Review</Link>
    </nav>
  )
}
