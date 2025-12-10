import { z } from 'zod'

export const CreateUserAppAccessSchema = z.object({
  user_id: z.string().min(1, 'User wajib diisi'),
  app_id: z.string().min(1, 'Aplikasi wajib diisi')
})

export const EditUserAppAccessSchema = CreateUserAppAccessSchema.partial()

export type CreateUserAppAccessFormValues = z.infer<typeof CreateUserAppAccessSchema>
export type UpdateUserAppAccessFormValues = z.infer<typeof EditUserAppAccessSchema>
