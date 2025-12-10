import { z } from 'zod'

export const CreateClientAppSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter'),
  logoUrl: z.url('URL logo tidak valid').optional(),
  clientId: z.string().min(3, 'Client ID minimal 3 karakter'),
  clientSecret: z.string().min(6, 'Client Secret minimal 6 karakter'),
  redirectUri: z.url('Redirect URI harus URL yang valid'),
  dashboardUrl: z.url('Dashboard URL harus URL yang valid')
})

export const EditClientAppSchema = CreateClientAppSchema.partial()

export type CreateClientAppFormValues = z.infer<typeof CreateClientAppSchema>
export type UpdateClientAppFormValues = z.infer<typeof EditClientAppSchema>
