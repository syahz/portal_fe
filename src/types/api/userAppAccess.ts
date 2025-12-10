export interface UserAppAccess {
  data: {
    user_id: string
    app_id: string
  }
}
export interface CreateUserAppAccessRequest {
  user_id: string
  app_id: string
}

export interface UpdateUserAppAccessRequest {
  user_id?: string
  app_id?: string
}

export type UserAppAccessResponse = {
  id: string
  user_id: string
  app_id: string
}

export type UserAppAccessExpanded = {
  id: string
  user: { id: string; email: string; name: string }
  app: { id: string; name: string; client_id: string }
}
