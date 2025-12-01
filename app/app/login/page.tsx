'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn('email', { 
        email,
        callbackUrl: '/dashboard',
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (submitted) {
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
          <p>✅ Um link mágico foi enviado para <strong>{email}</strong></p>
          <p>Clique no link para acessar sua conta.</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            ⏱️ O link expira em 15 minutos.
          </p>
        </div>
        
        <button 
          onClick={() => setSubmitted(false)}
          style={{
            marginTop: '20px',
            background: '#6b7280',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Tentar outro email
        </button>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🔐 Login</h1>
      <p>Entre com seu email para receber um link mágico</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Email
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            data-testid="email-input"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading || !email}
          style={{
            marginTop: '20px',
            width: '100%',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #34d399)',
            color: '#000',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar link mágico'}
        </button>
      </form>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          💡 <strong>Dica:</strong> Verifique sua pasta de spam se não receber o email
        </p>
      </div>
    </div>
  )
}
