import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import PlaceholderBlock from '../components/layout/PlaceholderBlock'

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
      <div className="flex flex-col gap-6">
        <PlaceholderBlock
          title="Resumo do produtor"
          description={`Produtor #${id} — dados serão carregados na próxima etapa.`}
        />
        <PlaceholderBlock
          title="Fatores de risco"
          description="Aguardando cálculo do motor de scoring."
        />
        <PlaceholderBlock
          title="Evidências"
          description="Aguardando evidências coletadas."
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
