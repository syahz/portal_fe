import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import axiosInstance from '@/lib/axios'
import type { ApiError, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type { CreateUserAppAccessRequest, UpdateUserAppAccessRequest, UserAppAccess, UserAppAccessExpanded } from '@/types/api/userAppAccess'

export async function getUserAppAccesses(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedResponse<UserAppAccessExpanded>> {
  try {
    const response = await axiosInstance.get<RawPaginatedResponse<UserAppAccessExpanded>>('/admin/app-access', { params })
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'FETCH_USER_APP_ACCESS_ERROR', 'Failed to fetch user app accesses')
  }
}

export async function getUserAppAccessById(id: string): Promise<UserAppAccess> {
  try {
    const response = await axiosInstance.get<UserAppAccess>(`/admin/app-access/${id}`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'FETCH_USER_APP_ACCESS_ERROR', 'Failed to fetch user app access')
  }
}

export async function createUserAppAccess(payload: CreateUserAppAccessRequest): Promise<UserAppAccessExpanded> {
  try {
    const response = await axiosInstance.post<UserAppAccessExpanded>(`/admin/app-access`, payload)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'CREATE_USER_APP_ACCESS_ERROR', 'Failed to create user app access')
  }
}

export async function updateUserAppAccess(id: string, payload: UpdateUserAppAccessRequest): Promise<UserAppAccessExpanded> {
  try {
    const response = await axiosInstance.put<UserAppAccessExpanded>(`/admin/app-access/${id}`, payload)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'UPDATE_USER_APP_ACCESS_ERROR', 'Failed to update user app access')
  }
}

export async function deleteUserAppAccess(id: string): Promise<{ ok: boolean }> {
  try {
    const response = await axiosInstance.delete<{ ok: boolean }>(`/admin/app-access/${id}`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'DELETE_USER_APP_ACCESS_ERROR', 'Failed to delete user app access')
  }
}

function normalizeError(error: unknown, code: string, fallbackMsg: string): ApiError {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.message || fallbackMsg,
      code: err.response?.data?.code || code,
      details: err.response?.data?.details
    }
  }
  return { message: fallbackMsg, code, details: undefined }
}
