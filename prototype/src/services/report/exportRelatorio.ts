// Exportação do Relatório Padronizado de Risco em PDF e Excel (CSV).
// Reutilizado tanto pela Triagem quanto pelo drill-down do Produtor, já que
// os dois montam o mesmo formato de dados (RelatorioExportData) para o
// componente ScreeningResult.
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Evidence, Rating, RiskFactor } from '../../types/risk'

export interface RelatorioExportData {
  clientName: string
  document: string
  score: number
  rating: Rating
  operationalStatus: string
  factors: RiskFactor[]
  evidences: Evidence[]
  recommendationTitle: string
  recommendationBody: string
  atualizadoEm: string
  limitacoes: string
}

function nomeArquivo(dados: RelatorioExportData, extensao: string): string {
  const base = dados.document.replace(/\D/g, '') || 'relatorio'
  return `relatorio-risco-${base}.${extensao}`
}

function baixarArquivo(conteudo: BlobPart, tipoMime: string, nome: string) {
  const blob = new Blob([conteudo], { type: tipoMime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nome
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function gerarPdfRelatorio(dados: RelatorioExportData) {
  const doc = new jsPDF()
  const margemX = 14
  const larguraUtil = 182
  let cursorY = 18

  function garantirEspaco(alturaNecessaria: number) {
    if (cursorY + alturaNecessaria > 280) {
      doc.addPage()
      cursorY = 20
    }
  }

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório Padronizado de Risco', margemX, cursorY)
  cursorY += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120)
  doc.text('Sentinela Krill — protótipo de demonstração, dados fictícios', margemX, cursorY)
  doc.setTextColor(0)

  cursorY += 10
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(dados.clientName, margemX, cursorY)
  cursorY += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Documento: ${dados.document}`, margemX, cursorY)
  cursorY += 5
  doc.text(`Atualizado em: ${dados.atualizadoEm}`, margemX, cursorY)
  cursorY += 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Score: ${dados.score}/1000    Rating: ${dados.rating}    Status: ${dados.operationalStatus}`, margemX, cursorY)
  cursorY += 10

  doc.setFontSize(11)
  doc.text('Fatores de risco', margemX, cursorY)
  cursorY += 4

  autoTable(doc, {
    startY: cursorY,
    head: [['Fator', 'Peso', 'Status', 'Descrição']],
    body: dados.factors.map((fator) => [
      fator.title,
      typeof fator.weight === 'number' ? `${fator.weight}%` : '—',
      fator.status,
      fator.description ?? '',
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [57, 117, 76] },
    margin: { left: margemX, right: margemX },
  })
  cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

  if (dados.evidences.length > 0) {
    garantirEspaco(20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Evidências', margemX, cursorY)
    cursorY += 4

    autoTable(doc, {
      startY: cursorY,
      head: [['Título', 'Descrição', 'Fonte', 'Tipo']],
      body: dados.evidences.map((evidencia) => [
        evidencia.title,
        evidencia.description,
        evidencia.source,
        evidencia.sourceType,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [57, 117, 76] },
      margin: { left: margemX, right: margemX },
    })
    cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  }

  garantirEspaco(20)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Recomendação', margemX, cursorY)
  cursorY += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const linhasRecomendacao = doc.splitTextToSize(
    `${dados.recommendationTitle}. ${dados.recommendationBody}`,
    larguraUtil,
  )
  garantirEspaco(linhasRecomendacao.length * 4 + 4)
  doc.text(linhasRecomendacao, margemX, cursorY)
  cursorY += linhasRecomendacao.length * 4 + 8

  garantirEspaco(20)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Limitações do modelo', margemX, cursorY)
  cursorY += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const linhasLimitacoes = doc.splitTextToSize(dados.limitacoes, larguraUtil)
  garantirEspaco(linhasLimitacoes.length * 4)
  doc.text(linhasLimitacoes, margemX, cursorY)

  doc.save(nomeArquivo(dados, 'pdf'))
}

function csvEscape(valor: string | number | undefined): string {
  const texto = String(valor ?? '')
  if (/[";\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`
  }
  return texto
}

export function gerarExcelRelatorio(dados: RelatorioExportData) {
  const linhas: string[] = []

  linhas.push('Relatório Padronizado de Risco - Sentinela Krill (protótipo de demonstração)')
  linhas.push('')
  linhas.push(`Cliente;${csvEscape(dados.clientName)}`)
  linhas.push(`Documento;${csvEscape(dados.document)}`)
  linhas.push(`Score;${dados.score}`)
  linhas.push(`Rating;${dados.rating}`)
  linhas.push(`Status;${csvEscape(dados.operationalStatus)}`)
  linhas.push(`Atualizado em;${csvEscape(dados.atualizadoEm)}`)
  linhas.push('')
  linhas.push('Fatores de risco')
  linhas.push('Fator;Peso (%);Status;Descrição')
  for (const fator of dados.factors) {
    linhas.push(
      `${csvEscape(fator.title)};${fator.weight ?? ''};${csvEscape(fator.status)};${csvEscape(fator.description)}`,
    )
  }
  linhas.push('')
  linhas.push('Evidências')
  linhas.push('Título;Descrição;Fonte;Tipo')
  for (const evidencia of dados.evidences) {
    linhas.push(
      `${csvEscape(evidencia.title)};${csvEscape(evidencia.description)};${csvEscape(evidencia.source)};${csvEscape(evidencia.sourceType)}`,
    )
  }
  linhas.push('')
  linhas.push('Recomendação')
  linhas.push(`${csvEscape(dados.recommendationTitle)};${csvEscape(dados.recommendationBody)}`)
  linhas.push('')
  linhas.push('Limitações do modelo')
  linhas.push(csvEscape(dados.limitacoes))

  // BOM no início garante acentuação correta ao abrir no Excel do Windows.
  const bom = String.fromCharCode(0xfeff)
  const conteudo = bom + linhas.join('\r\n')
  baixarArquivo(conteudo, 'text/csv;charset=utf-8;', nomeArquivo(dados, 'csv'))
}
