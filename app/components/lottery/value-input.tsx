'use client'

import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { valueInputSchema } from '@/lib/validations/lottery'
import { cn } from '@/lib/utils'

export interface ValueInputProps {
  value?: number
  onChange?: (value: number | undefined) => void
  error?: string
  className?: string
}

/**
 * Input monetário formatado em Real (R$) com validação de range (R$10-R$500).
 * 
 * @example
 * ```tsx
 * <ValueInput 
 *   value={100} 
 *   onChange={(val) => console.log(val)} 
 * />
 * ```
 */
export function ValueInput({ value, onChange, error: externalError, className }: ValueInputProps) {
  const [internalError, setInternalError] = useState<string>('')

  const handleValueChange = (values: { floatValue?: number }) => {
    const newValue = values.floatValue

    // Validate with Zod
    const result = valueInputSchema.safeParse({ value: newValue })
    
    if (!result.success) {
      setInternalError(result.error.issues[0].message)
    } else {
      setInternalError('')
    }

    onChange?.(newValue)
  }

  const displayError = externalError || internalError

  return (
    <div className={cn('space-y-2', className)}>
      <NumericFormat
        value={value}
        onValueChange={handleValueChange}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        className={cn(
          'flex h-16 w-full rounded-lg border-2 bg-black/20 px-5 py-3 text-3xl font-bold tracking-tight',
          'text-white placeholder:text-muted-foreground/50',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          displayError ? 'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive' : 'border-white/10 focus-visible:border-[hsl(160,84%,39%)] focus-visible:ring-[hsl(160,84%,39%)]/20'
        )}
        placeholder="R$ 0,00"
        aria-label="Valor da aposta"
        aria-invalid={!!displayError}
        aria-describedby={displayError ? 'value-input-error' : undefined}
      />
      {displayError && (
        <p id="value-input-error" className="text-sm text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
