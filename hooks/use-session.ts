'use client'

import { useEffect, useState, useCallback } from 'react'

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  emailVerified: boolean
}

export interface Session {
  user: User
  expiresAt: Date
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/get-session')
        if (response.ok) {
          const data = await response.json()
          setSession(data)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      setSession(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }, [])

  return { session, loading, logout }
}
