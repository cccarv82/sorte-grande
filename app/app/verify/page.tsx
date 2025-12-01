export default function VerifyRequestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>📧 Verifique seu email</h1>
      
      <div style={{ 
        padding: '20px', 
        background: '#f0fdf4',
        borderRadius: '8px',
        border: '1px solid #10b981',
        marginTop: '20px'
      }}>
        <p>✅ <strong>Um link mágico foi enviado para o seu email!</strong></p>
        <p>Clique no link para acessar sua conta.</p>
        
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          background: '#fff',
          borderRadius: '6px',
          border: '1px solid #d1d5db'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            ⏱️ O link expira em <strong>15 minutos</strong>
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
          💡 Não recebeu o email?
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>Verifique sua pasta de <strong>spam/lixo eletrônico</strong></li>
          <li>Aguarde alguns minutos (pode demorar até 2 minutos)</li>
          <li>O email vem de: <strong>onboarding@resend.dev</strong></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/login" style={{
          display: 'inline-block',
          color: '#6b7280',
          textDecoration: 'underline',
          fontSize: '14px'
        }}>
          ← Voltar para login
        </a>
      </div>
    </div>
  )
}
