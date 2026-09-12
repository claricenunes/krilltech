import ClientTable from '../components/dashboard/ClientTable'
import PageShell from '../components/layout/PageShell'
import { mockClients } from '../data/mockClients'

function Carteira() {
  return (
    <PageShell
      title="Carteira"
      subtitle="Clientes ativos com exposição em Arbolin Biogenesis concedida a prazo."
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer sm:p-6">
        <ClientTable clients={mockClients} />
      </div>
    </PageShell>
  )
}

export default Carteira
