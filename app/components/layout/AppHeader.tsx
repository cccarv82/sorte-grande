import Link from 'next/link'

export function AppHeader() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 
            className="text-2xl md:text-3xl font-bold cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Sorte Grande
          </h1>
        </Link>
        <Link href="/login">
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Entrar
          </button>
        </Link>
      </div>
    </header>
  )
}
