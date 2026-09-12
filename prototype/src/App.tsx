import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Produtor from './pages/Produtor'
import Radar from './pages/Radar'
import Triagem from './pages/Triagem'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Radar />} />
        <Route path="/triagem" element={<Triagem />} />
        <Route path="/produtor/:id" element={<Produtor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
