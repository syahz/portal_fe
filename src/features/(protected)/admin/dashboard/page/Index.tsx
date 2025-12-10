'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { PageContainer } from '@/components/layout/PageContainer'
const Index = () => {
  const { user } = useAuth()
  return <PageContainer>{user?.name}</PageContainer>
}

export default Index
