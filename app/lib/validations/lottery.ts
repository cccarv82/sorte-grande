import { z } from 'zod'

export const valueInputSchema = z.object({
  value: z.number()
    .min(10, 'Valor mínimo é R$ 10,00')
    .max(500, 'Valor máximo é R$ 500,00')
})

export type ValueInputData = z.infer<typeof valueInputSchema>
