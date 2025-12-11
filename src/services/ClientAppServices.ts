import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import axiosInstance from '@/lib/axios'
import type { ApiError, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type { CreateClientAppRequest, UpdateClientAppRequest, ClientApp } from '@/types/api/clientApp'

export async function getClientApps(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<ClientApp>> {
  try {
    const response = await axiosInstance.get<RawPaginatedResponse<ClientApp>>('/admin/apps', { params })
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'FETCH_CLIENT_APPS_ERROR', 'Failed to fetch client apps')
  }
}

export async function getClientAppById(id: string): Promise<ClientApp> {
  try {
    const response = await axiosInstance.get<ClientApp>(`/admin/apps/${id}`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'FETCH_CLIENT_APP_ERROR', 'Failed to fetch client app')
  }
}

export async function createClientApp(payload: CreateClientAppRequest): Promise<ClientApp> {
  try {
    const response = await axiosInstance.post<ClientApp>('/admin/apps', payload)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'CREATE_CLIENT_APP_ERROR', 'Failed to create client app')
  }
}

export async function updateClientApp(id: string, payload: UpdateClientAppRequest): Promise<ClientApp> {
  try {
    const response = await axiosInstance.patch<ClientApp>(`/admin/apps/${id}`, payload)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'UPDATE_CLIENT_APP_ERROR', 'Failed to update client app')
  }
}

export async function deleteClientApp(id: string): Promise<{ ok: boolean }> {
  try {
    const response = await axiosInstance.delete<{ ok: boolean }>(`/admin/apps/${id}`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'DELETE_CLIENT_APP_ERROR', 'Failed to delete client app')
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
