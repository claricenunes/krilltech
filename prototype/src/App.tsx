import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Produtor from './pages/Produtor'
import Radar from './pages/Radar'
import Triagem from './pages/Triagem'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50">
        <Header />
        <Routes>
          <Route path="/" element={<Radar />} />
          <Route path="/triagem" element={<Triagem />} />
          <Route path="/produtor/:id" element={<Produtor />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
