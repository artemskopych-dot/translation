'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Статична клієнтська сторінка: редірект на /translation
export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/translation')
  }, [router])
  return null
}

// Форс статичного рендеру
export const dynamic = 'force-static'
