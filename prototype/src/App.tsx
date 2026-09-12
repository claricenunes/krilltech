import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Carteira from './pages/Carteira'
import Configuracoes from './pages/Configuracoes'
import Dashboard from './pages/Dashboard'
import Produtor from './pages/Produtor'
import Relatorios from './pages/Relatorios'
import Triagem from './pages/Triagem'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/triagem" element={<Triagem />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/produtor/:id" element={<Produtor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
