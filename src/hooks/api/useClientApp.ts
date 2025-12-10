'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientApp, deleteClientApp, getClientAppById, getClientApps, updateClientApp } from '@/services/ClientAppServices'
import type { CreateClientAppRequest, UpdateClientAppRequest } from '@/types/api/clientApp'

export function useClientApps(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({ queryKey: ['client-apps', params], queryFn: () => getClientApps(params) })
}

export function useClientApp(id: string) {
  return useQuery({ queryKey: ['client-app', id], queryFn: () => getClientAppById(id), enabled: !!id })
}

export function useCreateClientApp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateClientAppRequest) => createClientApp(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-apps'] })
    }
  })
}

export function useUpdateClientApp(appId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateClientAppRequest) => updateClientApp(appId, data as UpdateClientAppRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-apps'] })
      queryClient.invalidateQueries({ queryKey: ['client-app', appId] })
    }
  })
}

export function useDeleteClientApp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteClientApp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-apps'] })
    }
  })
}
