'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true)
      
      // Use custom API route instead of NextAuth signIn to avoid SMTP split error
      const response = await fetch('/api/auth/resend-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle MVP limit or other errors
        if (result.error?.includes('MVP') || result.error?.includes('limit')) {
          toast.error('MVP lotado - lista de espera aberta', {
            description: 'Estamos em fase de testes. Entre na lista de espera!',
          })
        } else {
          toast.error(result.error || 'Erro ao enviar email')
        }
        return
      }

      toast.success('Email enviado!', {
        description: 'Verifique sua caixa de entrada para o link mágico.',
      })
      router.push(`/verify?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erro ao enviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Sorte Grande
          </h1>
          <p className="text-muted-foreground">
            Entre com seu email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className="h-12 text-lg mt-2"
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: '#000',
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar magic link'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Primeiro acesso? Basta digitar seu email para criar conta.
        </p>
      </div>
    </div>
  )
}
