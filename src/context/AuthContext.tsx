'use client'

import axiosInstance, { setAccessToken } from '../lib/axios'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  unit: string
  division: string
}
interface AuthContextType {
  user: User | null
  login: (accessToken: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await axiosInstance.post('/auth/refresh')
        setAccessToken(data.accessToken)
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          unit: data.user.unit,
          division: data.user.division
        })
      } catch (error) {
        console.log('No active session found or failed to refresh token.', error)
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  const login = (access_token: string, userData: User) => {
    setAccessToken(access_token)
    console.log('User data on login:', userData)
    setUser(userData)
    router.push('/admin')
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setAccessToken(null)
      setUser(null)
      window.location.href = '/login'
    }
  }

  const value = { user, login, logout, isLoading }

  return <AuthContext.Provider value={value}>{isLoading ? <DynamicSkeleton variant="fullPageLoader" /> : children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
