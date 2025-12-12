export interface ClientApp {
  id: string
  name: string
  description: string
  client_id: string
  client_secret: string
  redirect_uri: string
  dashboard_url: string
}
export interface CreateClientAppRequest {
  name: string
  description: string
  client_id: string
  client_secret: string
  redirect_uri: string
  dashboard_url: string
}

export interface UpdateClientAppRequest {
  name?: string
  description?: string
  client_id?: string
  client_secret?: string
  redirect_uri?: string
  dashboard_url?: string
}
