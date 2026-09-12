import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  generateProdutorReportPdf,
  type ProdutorReportInput,
} from '../../services/report/generateProdutorReport'

function DownloadReportButton(props: ProdutorReportInput) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setGenerating(true)
    setError(null)
    try {
      await generateProdutorReportPdf(props)
    } catch {
      setError('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={generating}
        className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white shadow-softer transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
        ) : (
          <Download className="h-4 w-4" strokeWidth={2.4} />
        )}
        {generating ? 'Gerando PDF...' : 'Baixar PDF do relatório completo'}
      </button>
      {error && <p className="text-xs text-alert-red-600">{error}</p>}
    </div>
  )
}

export default DownloadReportButton
