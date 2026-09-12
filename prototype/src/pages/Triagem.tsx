import Breadcrumb from '../components/layout/Breadcrumb'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import PlaceholderBlock from '../components/layout/PlaceholderBlock'

function Triagem() {
  return (
    <Container>
      <Breadcrumb
        items={[{ label: 'Radar da Carteira', to: '/' }, { label: 'Nova Triagem' }]}
      />
      <PageHeader
        title="Nova Triagem"
        subtitle="Avalie um novo cliente antes de ampliar sua exposição de crédito."
      />
      <PlaceholderBlock
        title="Consulta por CNPJ"
        description="Formulário de consulta será implementado na próxima etapa."
      />
    </Container>
  )
}

export default Triagem
