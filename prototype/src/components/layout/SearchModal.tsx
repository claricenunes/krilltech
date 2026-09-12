import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProdutores } from '../../services/api/staticData'
import type { ApiProdutor } from '../../services/api/krillApi'

interface SearchModalProps {
  onClose: () => void
}

function SearchModal({ onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [produtores, setProdutores] = useState<ApiProdutor[]>([])

  useEffect(() => {
    getProdutores().then(setProdutores).catch(() => setProdutores([]))
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    const normalizedDigits = normalized.replace(/\D/g, '')
    return produtores
      .filter(
        (produtor) =>
          produtor.nome.toLowerCase().includes(normalized) ||
          (normalizedDigits.length > 0 && produtor.cliente_id.includes(normalizedDigits)),
      )
      .slice(0, 6)
  }, [produtores, query])

  function handleSelectClient(id: string) {
    onClose()
    navigate(`/produtor/${id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center px-4 pt-[14vh]">
      <div
        className="fixed inset-0 bg-forest-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 h-fit w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-lifted animate-scale-in">
        <div className="flex items-center gap-3 border-b border-sage-100 px-5 py-4">
          <Search className="h-5 w-5 flex-shrink-0 text-forest-600" strokeWidth={2.2} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Buscar por CNPJ, CPF ou cliente..."
            className="w-full bg-transparent text-base text-forest-950 outline-none placeholder:text-sage-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sage-400 transition-colors hover:bg-sage-100 hover:text-forest-800"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin py-2">
          {query.trim() === '' ? (
            <p className="px-5 py-6 text-center text-sm text-sage-400">
              Digite um CNPJ, CPF ou o nome do cliente.
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-sage-400">
              Nenhum cliente encontrado para "{query}".
            </p>
          ) : (
            results.map((produtor) => (
              <button
                key={produtor.cliente_id}
                type="button"
                onClick={() => handleSelectClient(produtor.cliente_id)}
                className="flex w-full flex-col items-start px-5 py-3 text-left transition-colors hover:bg-sage-50"
              >
                <span className="text-sm font-medium text-forest-950">{produtor.nome}</span>
                <span className="text-xs text-sage-500">
                  {produtor.cliente_id} · {produtor.regiao}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
