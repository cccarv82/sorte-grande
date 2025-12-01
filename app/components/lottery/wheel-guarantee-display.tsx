'use client'

import { Badge } from '@/components/ui/badge'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export interface WheelGuaranteeDisplayProps {
  guaranteeType: string // e.g., "4 if 4", "5 if 6"
  explanation: string
  className?: string
}

/**
 * Badge exibindo garantia wheeling com tooltip explicativo.
 * 
 * @example
 * ```tsx
 * <WheelGuaranteeDisplay
 *   guaranteeType="4 if 4"
 *   explanation="Garante mínimo 4 acertos se tiver 4 números certos nas dezenas sorteadas"
 * />
 * ```
 */
export function WheelGuaranteeDisplay({ 
  guaranteeType, 
  explanation, 
  className 
}: WheelGuaranteeDisplayProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              'cursor-help border-primary/50 text-primary hover:bg-primary/10',
              className
            )}
            aria-label={`Garantia: ${guaranteeType}`}
          >
            ✓ {guaranteeType}
          </Badge>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
            sideOffset={5}
            aria-label="Explicação da garantia wheeling"
          >
            {explanation}
            <Tooltip.Arrow className="fill-border" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
