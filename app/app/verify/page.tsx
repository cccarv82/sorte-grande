import { ResendButton } from '@/components/auth/ResendButton'

interface VerifyPageProps {
  searchParams: {
    email?: string
  }
}

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const email = searchParams.email || 'seu email'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Icon */}
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            Email enviado!
          </h1>
          <p className="text-lg text-muted-foreground">
            Clique no link enviado para <strong className="text-white font-medium">{email}</strong>
          </p>
        </div>

        {/* Info boxes */}
        <div className="space-y-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              ⏱️ Link expira em <strong>15 minutos</strong>
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Se não receber, verifique spam
            </p>
          </div>
        </div>

        {/* Resend Button */}
        <div className="mt-8">
          <ResendButton email={email} />
        </div>
      </div>
    </div>
  )
}
