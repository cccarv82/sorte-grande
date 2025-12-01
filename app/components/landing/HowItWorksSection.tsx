export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Informe o valor',
      description: 'Digite quanto você quer investir'
    },
    {
      number: 2,
      title: 'Receba jogos otimizados',
      description: 'Sistema aplica Wheeling Systems automaticamente'
    },
    {
      number: 3,
      title: 'Copie e realize',
      description: 'Cole na Loteria Online da Caixa'
    },
    {
      number: 4,
      title: 'Verificação automática',
      description: 'Receba notificação se ganhar'
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
        Como funciona
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
              }}
            >
              {step.number}
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
