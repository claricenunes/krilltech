import { FileText } from 'lucide-react'
import EmptyState from '../components/layout/EmptyState'
import PageShell from '../components/layout/PageShell'

function Relatorios() {
  return (
    <PageShell
      title="Relatórios"
      subtitle="Exportações e relatórios consolidados da carteira de crédito."
    >
      <EmptyState
        icon={FileText}
        title="Nenhum relatório gerado ainda"
        description="Em breve você poderá exportar relatórios consolidados de carteira, risco e inadimplência diretamente por aqui."
      />
    </PageShell>
  )
}

export default Relatorios
