export interface ClientApp {
  id: string
  name: string
  description?: string | null
  logoUrl?: string | null
  clientId: string
  clientSecret: string
  redirectUri: string
  dashboardUrl: string
}
export interface CreateClientAppRequest {
  name: string
  description?: string | null
  logoUrl?: string | null
  clientId: string
  clientSecret: string
  redirectUri: string
  dashboardUrl: string
}

export interface UpdateClientAppRequest {
  name?: string
  description?: string | null
  logoUrl?: string | null
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  dashboardUrl?: string
}
