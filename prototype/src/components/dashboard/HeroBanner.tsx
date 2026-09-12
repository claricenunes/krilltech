import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HeroIllustration from '../illustrations/HeroIllustration'

function HeroBanner() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden rounded-3xl bg-forest-900 shadow-lifted animate-fade-up">
      <div className="absolute inset-0">
        <HeroIllustration className="h-full w-full opacity-90" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/75 to-transparent" />

      <div className="relative flex flex-col gap-6 px-8 py-10 sm:px-10 sm:py-12 lg:max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-200">
          Prevenção é o melhor crédito
        </p>
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            KrillRadar
          </h2>
          <p className="mt-3 text-lg font-medium text-forest-50">
            Inteligência para decisões mais seguras no agronegócio.
          </p>
          <p className="mt-2 max-w-md text-sm text-forest-200">
            Antecipe sinais de risco antes que eles se transformem em
            inadimplência.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/triagem')}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-forest-50 px-5 py-3 text-sm font-semibold text-forest-900 shadow-softer transition-all hover:bg-white hover:shadow-lifted active:scale-[0.98]"
        >
          Nova triagem
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </section>
  )
}

export default HeroBanner
