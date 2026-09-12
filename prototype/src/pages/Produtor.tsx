import { Link, useParams } from 'react-router-dom'

function Produtor() {
  const { id } = useParams()

  return (
    <div>
      <h1>Drill-down do Produtor</h1>
      <p>Rota: /produtor/{id}</p>
      <p>
        <Link to="/">Voltar ao Radar</Link>
      </p>
    </div>
  )
}

export default Produtor
