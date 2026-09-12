import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import PlaceholderBlock from '../components/layout/PlaceholderBlock'
import RiskReport from '../components/risk/RiskReport'
import { mockRiskReport } from '../data/mock-risk'

function Produtor() {
  const { id } = useParams()

  return (
    <Container>
      <Breadcrumb
        items={[{ label: 'Radar da Carteira', to: '/' }, { label: 'Produtor' }]}
      />
      <PageHeader
        title="Análise do Produtor"
        subtitle="Visão detalhada dos fatores que influenciam o risco deste cliente."
      />

      <div className="mb-6 rounded-lg border border-dashed border-stone-300 bg-stone-100 px-4 py-2 text-xs font-medium text-stone-500">
        MOCK — dados de demonstração para o produtor #{id}, sem relação com
        clientes reais da KRILLTECH. Usado apenas para validar os componentes
        visuais desta etapa.
      </div>

      <div className="flex flex-col gap-6">
        <RiskReport
          score={mockRiskReport.score}
          rating={mockRiskReport.rating}
          trend={mockRiskReport.trend}
          factors={mockRiskReport.factors}
          evidences={mockRiskReport.evidences}
        />
        <PlaceholderBlock
          title="Simulador"
          description="Simulador de cenário será implementado na próxima etapa."
        />
      </div>
    </Container>
  )
}

export default Produtor
