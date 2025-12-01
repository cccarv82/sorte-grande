import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface LotteryGameCardProps {
  title: string
  numbers: number[]
  date?: string
  status?: 'pending' | 'realized' | 'winner' | 'loser'
  prize?: string
  className?: string
}

/**
 * Card exibindo um jogo de loteria com números em grid circular.
 * 
 * @example
 * ```tsx
 * <LotteryGameCard
 *   title="Mega-Sena 2650"
 *   numbers={[5, 12, 23, 34, 45, 56]}
 *   date="2025-12-10"
 *   status="pending"
 * />
 * ```
 */
export function LotteryGameCard({ 
  title, 
  numbers, 
  date, 
  status = 'pending',
  prize,
  className 
}: LotteryGameCardProps) {
  const statusBadgeVariant = {
    'pending': 'default' as const,
    'realized': 'secondary' as const,
    'winner': 'default' as const,
    'loser': 'outline' as const
  }[status]

  const statusText = {
    'pending': 'Aguardando',
    'realized': 'Realizado',
    'winner': 'Premiado! 🎉',
    'loser': 'Não premiado'
  }[status]

  return (
    <Card 
      className={cn('transition-all duration-300 hover:scale-[1.01]', className)}
      style={{
        borderColor: 'hsl(0 0% 14%)',
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'hsl(160 84% 39% / 0.5)';
        e.currentTarget.style.boxShadow = '0 10px 40px -10px hsl(160 84% 39% / 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'hsl(0 0% 14%)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={statusBadgeVariant} className={status === 'winner' ? 'bg-primary' : ''}>
            {statusText}
          </Badge>
        </div>
        {date && (
          <CardDescription>
            {new Date(date).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          'grid gap-2',
          numbers.length <= 6 ? 'grid-cols-6' : 
          numbers.length <= 10 ? 'grid-cols-5' : 
          'grid-cols-6 sm:grid-cols-8'
        )}>
          {numbers.map((num, idx) => (
            <div
              key={idx}
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all cursor-default shadow-sm"
              style={{
                background: 'linear-gradient(135deg, hsl(160 84% 39% / 0.15) 0%, hsl(160 84% 39% / 0.05) 100%)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'hsl(160 84% 39% / 0.6)',
                color: 'hsl(160 84% 50%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(160 84% 35%) 100%)';
                e.currentTarget.style.borderColor = 'hsl(160 84% 45%)';
                e.currentTarget.style.color = 'hsl(0 0% 0%)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px hsl(160 84% 39% / 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, hsl(160 84% 39% / 0.15) 0%, hsl(160 84% 39% / 0.05) 100%)';
                e.currentTarget.style.borderColor = 'hsl(160 84% 39% / 0.6)';
                e.currentTarget.style.color = 'hsl(160 84% 50%)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
              }}
              aria-label={`Número ${num}`}
            >
              {num}
            </div>
          ))}
        </div>
      </CardContent>
      {prize && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Prêmio: <span className="font-semibold text-primary">{prize}</span>
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
