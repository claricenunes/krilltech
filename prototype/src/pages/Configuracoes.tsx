import { Settings } from 'lucide-react'
import EmptyState from '../components/layout/EmptyState'
import PageShell from '../components/layout/PageShell'

function Configuracoes() {
  return (
    <PageShell
      title="Configurações"
      subtitle="Preferências da conta e da organização KRILLTECH."
    >
      <EmptyState
        icon={Settings}
        title="Configurações em desenvolvimento"
        description="Gestão de usuários, permissões e integrações do KrillRadar estarão disponíveis aqui em uma próxima etapa."
      />
    </PageShell>
  )
}

export default Configuracoes
