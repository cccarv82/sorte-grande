import type { Metadata } from 'next'
import { AppHeader } from '@/components/layout/AppHeader'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { DisclaimerSection } from '@/components/landing/DisclaimerSection'

export const metadata: Metadata = {
  title: 'Sorte Grande - Apostas Inteligentes Baseadas em Matemática',
  description: 'A primeira plataforma brasileira a usar Wheeling Systems para organizar suas apostas de loteria de forma estratégica. Mega Sena e Lotofácil.',
  keywords: 'loteria, mega sena, lotofácil, wheeling systems, apostas inteligentes',
}

export default function Home() {
  return (
    <>
      <AppHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DisclaimerSection />
      </main>
      <Footer />
    </>
  )
}
