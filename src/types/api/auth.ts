export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  portal_session: string
  access_token: string
  user: {
    id: string
    email: string
    name: string
    role: string
    unit: string
    division: string
  }
}

export interface LogoutResponse {
  ok: boolean
}
