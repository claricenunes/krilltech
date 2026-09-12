import { Search } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { formatCnpj, isValidCnpj, normalizeCnpj } from '../../utils/cnpj'

interface CnpjInputProps {
  onSubmit: (cnpj: string) => void
  isLoading: boolean
}

function CnpjInput({ onSubmit, isLoading }: CnpjInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(formatCnpj(event.target.value))
    if (error) setError(null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const digits = normalizeCnpj(value)

    if (!isValidCnpj(digits)) {
      setError('Informe um CNPJ válido.')
      return
    }

    setError(null)
    onSubmit(digits)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sage-200/70 bg-white p-6 shadow-softer sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
        Nova triagem
      </p>
      <label htmlFor="cnpj" className="mt-3 block text-sm font-medium text-forest-800">
        CNPJ ou CPF
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div
          className={`flex flex-1 items-center gap-2.5 rounded-xl border bg-cream-25 px-3.5 py-3 transition-colors focus-within:border-forest-500 ${
            error ? 'border-alert-red-500' : 'border-sage-200'
          }`}
        >
          <Search className="h-4 w-4 flex-shrink-0 text-sage-400" strokeWidth={2} />
          <input
            id="cnpj"
            name="cnpj"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00.000.000/0000-00"
            value={value}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={error ? true : undefined}
            className="w-full bg-transparent text-base text-forest-950 outline-none placeholder:text-sage-400 disabled:text-sage-400"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-softer transition-all hover:bg-forest-800 hover:shadow-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sage-300 sm:flex-shrink-0"
        >
          {isLoading ? 'Consultando cadastro...' : 'Analisar cliente →'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-alert-red-600">{error}</p>}
    </form>
  )
}

export default CnpjInput
