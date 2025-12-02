// lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email muito curto')
    .max(255, 'Email muito longo')
    .toLowerCase()
    .trim(),
})

export type LoginInput = z.infer<typeof loginSchema>
