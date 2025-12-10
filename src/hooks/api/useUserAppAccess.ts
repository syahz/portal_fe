'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUserAppAccess,
  deleteUserAppAccess,
  getUserAppAccessById,
  getUserAppAccesses,
  updateUserAppAccess
} from '@/services/UserAppAccessServices'
import type { CreateUserAppAccessRequest, UpdateUserAppAccessRequest } from '@/types/api/userAppAccess'

export function useUserAppAccesses(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({ queryKey: ['user-app-accesses', params], queryFn: () => getUserAppAccesses(params) })
}

export function useUserAppAccess(id: string) {
  return useQuery({ queryKey: ['user-app-access', id], queryFn: () => getUserAppAccessById(id), enabled: !!id })
}

export function useCreateUserAppAccess() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserAppAccessRequest) => createUserAppAccess(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-app-accesses'] })
    }
  })
}

export function useUpdateUserAppAccess(accessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserAppAccessRequest) => updateUserAppAccess(accessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-app-accesses'] })
      queryClient.invalidateQueries({ queryKey: ['user-app-access', accessId] })
    }
  })
}

export function useDeleteUserAppAccess() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUserAppAccess(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-app-accesses'] })
    }
  })
}
