import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoUrl from '../../logo.png'
import type { ApiProdutor } from '../api/krillApi'
import type { FatorScoring, TimelineEvento } from '../api/staticData'
import type { ScoreTrendPoint } from '../../components/charts/ScoreTrendChart'
import type { Rating } from '../../types/risk'
import { formatCnpj } from '../../utils/cnpj'
import { formatCurrency } from '../../utils/currency'
import { RATING_HEX } from '../../utils/rating'

export interface ProdutorReportInput {
  produtor: ApiProdutor
  score: { score: number; rating: Rating; fatores: FatorScoring[] }
  sintese: { texto_explicativo: string; recomendacao: string } | null
  trendPoints: ScoreTrendPoint[]
  timeline: TimelineEvento[]
}

const FOREST_950 = '#0f2417'
const FOREST_700 = '#234c31'
const FOREST_100 = '#dbe7db'
const FOREST_50 = '#f0f5ee'
const SAGE_600 = '#6d8a68'
const SAGE_500 = '#86a181'
const SAGE_200 = '#dde8d5'
const CREAM_50 = '#f8f6ee'
const RED_600 = '#c0392b'
const WHITE = '#ffffff'

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const value = parseInt(clean, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function loadImageAsDataUrl(url: string): Promise<string> {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('Não foi possível carregar o logo.'))
          reader.readAsDataURL(blob)
        }),
    )
}

function fill(doc: jsPDF, hex: string) {
  doc.setFillColor(...hexToRgb(hex))
}

function textColor(doc: jsPDF, hex: string) {
  doc.setTextColor(...hexToRgb(hex))
}

function drawColor(doc: jsPDF, hex: string) {
  doc.setDrawColor(...hexToRgb(hex))
}

/**
 * Relatório de risco completo, gerado no cliente com a identidade visual do
 * KrillRadar. Não é uma captura de tela: cada seção é desenhada como texto e
 * tabelas nativas do PDF, para ficar organizado e pesquisável mesmo em várias
 * páginas.
 */
export async function generateProdutorReportPdf({
  produtor,
  score,
  sintese,
  trendPoints,
  timeline,
}: ProdutorReportInput): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 16
  const contentWidth = pageWidth - marginX * 2
  const bottomLimit = pageHeight - 20

  function ensureSpace(y: number, needed: number): number {
    if (y + needed > bottomLimit) {
      doc.addPage()
      return 24
    }
    return y
  }

  // --- Cabeçalho -----------------------------------------------------
  try {
    const logoDataUrl = await loadImageAsDataUrl(logoUrl)
    doc.addImage(logoDataUrl, 'PNG', marginX, 12, 11, 11.3)
  } catch {
    // Sem logo, segue sem quebrar a geração do relatório.
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  textColor(doc, FOREST_950)
  doc.text('KrillRadar', marginX + 15, 18.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  textColor(doc, SAGE_600)
  doc.text('Relatório de Risco de Crédito', marginX + 15, 23.5)

  doc.setFontSize(8)
  textColor(doc, SAGE_500)
  doc.text(`Emitido em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - marginX, 15, {
    align: 'right',
  })
  doc.text('Protótipo de demonstração — dados fictícios', pageWidth - marginX, 19.5, {
    align: 'right',
  })

  drawColor(doc, SAGE_200)
  doc.setLineWidth(0.4)
  doc.line(marginX, 27, pageWidth - marginX, 27)

  // --- Cliente + score em destaque ------------------------------------
  let y = 37
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13.5)
  textColor(doc, FOREST_950)
  doc.text(produtor.nome, marginX, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  textColor(doc, SAGE_600)
  doc.text(
    `CNPJ ${formatCnpj(produtor.cliente_id)}  ·  ${produtor.regiao}  ·  ${produtor.cultura}`,
    marginX,
    y + 5.5,
  )
  doc.text(
    `Classificação: ${produtor.classificacao ?? 'N/D'}  ·  Situação cadastral: ${produtor.situacao_cadastral}`,
    marginX,
    y + 10.5,
  )

  const scoreBoxWidth = 38
  const scoreBoxHeight = 22
  const scoreBoxX = pageWidth - marginX - scoreBoxWidth
  const scoreBoxY = y - 9
  fill(doc, RATING_HEX[score.rating])
  doc.roundedRect(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, 2.5, 2.5, 'F')
  textColor(doc, WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text(String(score.score), scoreBoxX + scoreBoxWidth / 2, scoreBoxY + 12, {
    align: 'center',
  })
  doc.setFontSize(9)
  doc.text(`Rating ${score.rating}`, scoreBoxX + scoreBoxWidth / 2, scoreBoxY + 18, {
    align: 'center',
  })

  y += 18

  // --- Fatores de risco -------------------------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  textColor(doc, FOREST_950)
  doc.text('Por que este cliente recebeu este score?', marginX, y)
  y += 4

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Fator', 'Peso', 'Status', 'Justificativa']],
    body: score.fatores.map((fator) => [
      fator.title,
      `${fator.weight}%`,
      fator.status,
      fator.description,
    ]),
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.6, textColor: hexToRgb(FOREST_950) },
    headStyles: { fillColor: hexToRgb(FOREST_700), textColor: hexToRgb(WHITE), fontStyle: 'bold' },
    alternateRowStyles: { fillColor: hexToRgb(CREAM_50) },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 16, halign: 'center' },
      2: { cellWidth: 26 },
      3: { cellWidth: 'auto' },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 9

  // --- Explicação do score ----------------------------------------------
  if (sintese?.texto_explicativo) {
    y = ensureSpace(y, 22)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    textColor(doc, FOREST_950)
    doc.text('Explicação do score', marginX, y)
    y += 5.5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    textColor(doc, SAGE_600)
    const lines = doc.splitTextToSize(sintese.texto_explicativo, contentWidth)
    y = ensureSpace(y, lines.length * 4.4)
    doc.text(lines, marginX, y)
    y += lines.length * 4.4 + 6
  }

  // --- Recomendação -------------------------------------------------------
  if (sintese?.recomendacao) {
    const recLines = doc.splitTextToSize(sintese.recomendacao, contentWidth - 8)
    const boxHeight = recLines.length * 4.3 + 16
    y = ensureSpace(y, boxHeight)

    fill(doc, FOREST_50)
    drawColor(doc, FOREST_100)
    doc.setLineWidth(0.3)
    doc.roundedRect(marginX, y, contentWidth, boxHeight, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    textColor(doc, FOREST_700)
    doc.text('RECOMENDAÇÃO DO KRILLRADAR   —   IA sugere · gestor decide', marginX + 4, y + 6)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    textColor(doc, FOREST_950)
    doc.text(recLines, marginX + 4, y + 12)

    y += boxHeight + 9
  }

  // --- Evolução do score --------------------------------------------------
  if (trendPoints.length > 0) {
    y = ensureSpace(y, 30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    textColor(doc, FOREST_950)
    doc.text('Evolução do score: histórico, atual e projetado', marginX, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Momento', 'Score', 'Rating', 'Observação']],
      body: trendPoints.map((point) => [
        point.label,
        String(Math.round(point.score)),
        point.rating,
        point.projected
          ? 'Cenário simulado para os próximos 12 meses — não é um fato.'
          : 'Realizado.',
      ]),
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.6, textColor: hexToRgb(FOREST_950) },
      headStyles: { fillColor: hexToRgb(FOREST_700), textColor: hexToRgb(WHITE), fontStyle: 'bold' },
      alternateRowStyles: { fillColor: hexToRgb(CREAM_50) },
      columnStyles: {
        0: { cellWidth: 34 },
        1: { cellWidth: 18, halign: 'center' },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 'auto' },
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 9
  }

  // --- Exposição x capacidade de pagamento --------------------------------
  const covered = produtor.margem_liquida >= produtor.exposicao
  y = ensureSpace(y, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  textColor(doc, FOREST_950)
  doc.text('Exposição x capacidade de pagamento', marginX, y)
  y += 4

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Item', 'Valor', 'Observação']],
    body: [
      ['Exposição atual (KRILLTECH)', formatCurrency(produtor.exposicao), ''],
      [
        'Margem líquida do produtor',
        formatCurrency(produtor.margem_liquida),
        covered ? 'Cobre a exposição atual.' : 'Não cobre a exposição atual — sinal de atenção.',
      ],
      ['Limite de crédito aprovado', formatCurrency(produtor.limite_credito), ''],
    ],
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.6, textColor: hexToRgb(FOREST_950) },
    headStyles: { fillColor: hexToRgb(FOREST_700), textColor: hexToRgb(WHITE), fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 35 }, 2: { cellWidth: 'auto' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === 1 && !covered) {
        data.cell.styles.textColor = hexToRgb(RED_600)
      }
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 9

  // --- Histórico de eventos ------------------------------------------------
  if (timeline.length > 0) {
    y = ensureSpace(y, 30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    textColor(doc, FOREST_950)
    doc.text('Histórico de eventos', marginX, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Data', 'Tipo', 'Evento', 'Descrição']],
      body: timeline.map((evento) => [
        evento.data,
        evento.tipo,
        evento.titulo,
        evento.descricao,
      ]),
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.6, textColor: hexToRgb(FOREST_950) },
      headStyles: { fillColor: hexToRgb(FOREST_700), textColor: hexToRgb(WHITE), fontStyle: 'bold' },
      alternateRowStyles: { fillColor: hexToRgb(CREAM_50) },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 22 },
        2: { cellWidth: 40 },
        3: { cellWidth: 'auto' },
      },
    })
  }

  // --- Rodapé em todas as páginas ------------------------------------------
  const totalPages = doc.getNumberOfPages()
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    drawColor(doc, SAGE_200)
    doc.setLineWidth(0.2)
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    textColor(doc, SAGE_500)
    doc.text(
      `MOCK — dados de demonstração para ${produtor.nome}, sem relação com clientes reais da KRILLTECH.`,
      marginX,
      pageHeight - 9,
    )
    doc.text(`Página ${page} de ${totalPages}`, pageWidth - marginX, pageHeight - 9, {
      align: 'right',
    })
  }

  const slug = produtor.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  doc.save(`relatorio-risco-${slug || produtor.cliente_id}.pdf`)
}
