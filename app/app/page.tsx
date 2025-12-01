export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>🎰 Sorte Grande</h1>
      <p>Bem-vindo à plataforma de sugestões de loteria!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ 
          display: 'inline-block',
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          color: '#000',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Acessar Dashboard
        </a>
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>
        ℹ️ Você será redirecionado para /login se não estiver autenticado
      </p>
    </div>
  )
}
