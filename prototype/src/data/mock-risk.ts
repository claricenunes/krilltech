// Resultado demonstrativo da Triagem de um cliente novo.
// Usado no fluxo "Nova triagem" independentemente do CNPJ consultado,
// já que o motor definitivo de scoring ainda não está implementado.
// NÃO representa nenhum cliente real da KRILLTECH.
import type { Rating, RiskFactor } from '../types/risk'

interface TriageResult {
  score: number
  rating: Rating
}

export const triageResult: TriageResult = {
  score: 412,
  rating: 'C',
}

export const triageFactors: RiskFactor[] = [
  {
    factorKey: 'cadastral',
    title: 'Situação cadastral',
    status: 'OK',
    description: 'Empresa ativa, sem pendências junto à Receita Federal.',
    source: 'Receita Federal',
  },
  {
    factorKey: 'judicial',
    title: 'Histórico judicial',
    status: 'Atenção',
    description: 'Processo judicial em andamento identificado para o CNPJ.',
    source: 'CNJ / DataJud',
  },
  {
    factorKey: 'ambiental',
    title: 'Ambiental',
    status: 'Risco identificado',
    description: 'Embargo ambiental ativo na propriedade associada.',
    source: 'IBAMA',
  },
  {
    factorKey: 'clima',
    title: 'Clima e produtividade',
    status: 'Risco elevado',
    description: 'Queda de produtividade projetada para a região na safra atual.',
    source: 'Dados agroclimáticos',
  },
]
