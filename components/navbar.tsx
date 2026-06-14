'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { session, logout } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">AP</span>
            </div>
            <span className="hidden sm:inline">Anti Penyimpangan</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              Forum
            </Link>
            {session?.user ? (
              <>
                <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Selamat datang, {session.user.name}</span>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:opacity-80 transition-opacity">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-primary-foreground/20">
            <Link href="/" className="block px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
              Forum
            </Link>
            {session?.user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 hover:bg-primary-foreground/10 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 hover:bg-primary-foreground/10 rounded-md">
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
