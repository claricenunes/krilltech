import { Link } from 'react-router-dom'

function Radar() {
  return (
    <div>
      <h1>Radar da Carteira</h1>
      <p>Rota: /</p>
      <p>
        <Link to="/triagem">Ir para Triagem</Link>
        {' · '}
        <Link to="/produtor/1">Ir para Produtor (exemplo)</Link>
      </p>
    </div>
  )
}

export default Radar
