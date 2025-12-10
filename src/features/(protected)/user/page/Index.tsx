'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import React, { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUserAppAccesses } from '@/hooks/api/useUserAppAccess'
import { useClientApps } from '@/hooks/api/useClientApp'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios'

const UserAppsPage = () => {
  const { user } = useAuth()

  const { data: accessData, isLoading: isLoadingAccess, error: accessError } = useUserAppAccesses({ page: 1, limit: 100 })
  const { data: appsData, isLoading: isLoadingApps, error: appsError } = useClientApps({ page: 1, limit: 100 })

  const myAppIds = useMemo(() => {
    if (!user || !accessData?.items) return [] as string[]
    return accessData.items.filter((acc) => acc.user.id === user.id).map((acc) => acc.app.id)
  }, [user, accessData])

  const myApps = useMemo(() => {
    const apps = appsData?.items ?? []
    if (!myAppIds.length) return []
    const set = new Set(myAppIds)
    return apps.filter((a) => set.has(a.id))
  }, [appsData, myAppIds])

  const handleOpenApp = async (appId: string, dashboardUrl: string, clientId?: string) => {
    try {
      const { data } = await axiosInstance.post('/auth/sso', { appId })
      const ssoUrl: string | undefined = data?.url
      if (ssoUrl) {
        window.open(ssoUrl, '_blank', 'noopener')
        return
      }
    } catch (err) {
      console.error('SSO Error:', err)
    }

    const url = new URL(dashboardUrl)
    if (clientId) {
      url.searchParams.set('client_id', clientId)
    }
    window.open(url.toString(), '_blank', 'noopener')
  }

  const isLoading = isLoadingAccess || isLoadingApps
  const hasError = accessError || appsError

  return (
    <PageContainer title="Aplikasi Saya">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border p-4">
              <div className="h-6 w-1/2 bg-muted mb-2" />
              <div className="h-4 w-3/4 bg-muted" />
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="text-sm text-red-600">Gagal memuat aplikasi. Silakan coba lagi.</div>
      ) : myApps.length === 0 ? (
        <div className="text-sm text-muted-foreground">Tidak ada aplikasi yang tersedia untuk akun Anda.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{app.name}</span>
                </CardTitle>
                {app.description && <CardDescription>{app.description}</CardDescription>}
              </CardHeader>
              <div className="px-6 pb-6">
                <Button onClick={() => handleOpenApp(app.id, app.dashboardUrl, app.clientId)} className="w-full">
                  Buka {app.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Contoh SSO fallback di atas */}
    </PageContainer>
  )
}

export default UserAppsPage
