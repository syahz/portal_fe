'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
const Index = () => {
  const { user } = useAuth()
  return <div>{user?.name}</div>
}

export default Index
