import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Sorte Grande. Todos os direitos reservados.</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Como Funciona
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
