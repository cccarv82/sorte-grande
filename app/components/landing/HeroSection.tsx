import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        Apostas inteligentes<br />baseadas em matemática
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        A primeira plataforma brasileira a usar Wheeling Systems - metodologia cientificamente validada para organizar suas apostas de forma estratégica.
      </p>
      <Link href="/login">
        <button
          className="px-8 py-4 text-lg font-bold rounded-lg text-black w-full md:w-auto"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}
        >
          ✨ Começar Grátis
        </button>
      </Link>
    </section>
  )
}
