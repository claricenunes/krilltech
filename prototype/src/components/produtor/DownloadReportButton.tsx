import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  generateProdutorReportExcel,
  generateProdutorReportPdf,
  type ProdutorReportInput,
} from '../../services/report/generateProdutorReport'

function DownloadReportButton(props: ProdutorReportInput) {
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePdf() {
    setGeneratingPdf(true)
    setError(null)
    try {
      await generateProdutorReportPdf(props)
    } catch {
      setError('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  function handleExcel() {
    setError(null)
    try {
      generateProdutorReportExcel(props)
    } catch {
      setError('Não foi possível gerar o Excel. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePdf}
          disabled={generatingPdf}
          className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white shadow-softer transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generatingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
          ) : (
            <Download className="h-4 w-4" strokeWidth={2.4} />
          )}
          {generatingPdf ? 'Gerando PDF...' : 'Baixar PDF'}
        </button>
        <button
          type="button"
          onClick={handleExcel}
          className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 transition-colors hover:border-forest-300 hover:bg-sage-50"
        >
          <FileSpreadsheet className="h-4 w-4" strokeWidth={2.4} />
          Baixar Excel
        </button>
      </div>
      {error && <p className="text-xs text-alert-red-600">{error}</p>}
    </div>
  )
}

export default DownloadReportButton
