import { Link } from 'react-router-dom'

function Triagem() {
  return (
    <div>
      <h1>Triagem de Cliente Novo</h1>
      <p>Rota: /triagem</p>
      <p>
        <Link to="/">Voltar ao Radar</Link>
      </p>
    </div>
  )
}

export default Triagem
