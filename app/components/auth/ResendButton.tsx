'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ResendButtonProps {
  email: string
}

export function ResendButton({ email }: ResendButtonProps) {
  const [countdown, setCountdown] = useState(30)
  const [isResending, setIsResending] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer) // Cleanup to prevent memory leaks
    }
  }, [countdown])

  const handleResend = async () => {
    setIsResending(true)
    
    try {
      const result = await signIn('email', { 
        email, 
        redirect: false 
      })
      
      if (result?.error) {
        // Check for MVP limit error
        if (result.error.includes('MVP') || result.error.includes('limit')) {
          toast.error('MVP lotado - lista de espera aberta')
        } else {
          toast.error('Erro ao reenviar, tente novamente')
        }
      } else {
        toast.success('Email reenviado!')
        setCountdown(30) // Reset countdown after successful resend
      }
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Erro ao reenviar, tente novamente')
    } finally {
      setIsResending(false)
    }
  }

  const isDisabled = countdown > 0 || isResending
  const buttonLabel = isResending 
    ? 'Enviando...' 
    : countdown > 0 
      ? `Reenviar (${countdown}s)` 
      : 'Reenviar email'

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleResend}
        disabled={isDisabled}
        aria-label="Reenviar email de verificação"
        className="w-full h-12 text-base"
      >
        {buttonLabel}
      </Button>
      
      {/* Screen reader announcement for countdown */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {countdown > 0 ? `Aguarde ${countdown} segundos para reenviar` : 'Botão de reenvio disponível'}
      </div>
    </div>
  )
}
