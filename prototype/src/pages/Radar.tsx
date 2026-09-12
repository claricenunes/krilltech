import Breadcrumb from '../components/layout/Breadcrumb'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import PlaceholderBlock from '../components/layout/PlaceholderBlock'

function Radar() {
  return (
    <Container>
      <Breadcrumb items={[{ label: 'Radar da Carteira' }]} />
      <PageHeader
        title="Radar da Carteira"
        subtitle="Visão consolidada da exposição e dos sinais de deterioração da carteira."
      />
      <div className="flex flex-col gap-6">
        <PlaceholderBlock
          title="Resumo da carteira"
          description="Aguardando dados consolidados de exposição e risco."
        />
        <PlaceholderBlock
          title="Clientes em atenção"
          description="Aguardando dados dos produtores da carteira."
        />
        <PlaceholderBlock
          title="Alertas recentes"
          description="Nenhum alerta carregado ainda."
        />
      </div>
    </Container>
  )
}

export default Radar
