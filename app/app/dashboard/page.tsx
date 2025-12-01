import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>📊 Dashboard</h1>
      <p>Bem-vindo, <strong>{session.user?.email}</strong>!</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#f0fdf4',
        borderRadius: '8px',
        border: '1px solid #10b981'
      }}>
        <h2>✅ Autenticação OK</h2>
        <p>Você está autenticado via NextAuth v5 com magic link!</p>
        <p><strong>User ID:</strong> {session.user?.id}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/api/auth/signout" style={{ 
          display: 'inline-block',
          background: '#ef4444',
          color: '#fff',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Sair
        </a>
      </div>
    </div>
  )
}
