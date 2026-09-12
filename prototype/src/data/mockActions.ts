// Próximas ações sugeridas — demonstrativo para o MVP.
import type { PortfolioAction } from '../types/portfolio'

export const mockActions: PortfolioAction[] = [
  {
    id: 'action-1',
    title: 'Reavaliar exposição — 5 maiores clientes (GO)',
    priority: 'alta',
    due: 'Hoje',
    done: false,
  },
  {
    id: 'action-2',
    title: 'Verificar embargo ambiental — Cliente 3421',
    priority: 'media',
    due: 'Amanhã',
    done: false,
  },
  {
    id: 'action-3',
    title: 'Analisar impacto climático — Região MT',
    priority: 'media',
    due: '3 dias',
    done: false,
  },
  {
    id: 'action-4',
    title: 'Atualizar dados cadastrais — 12 clientes',
    priority: 'baixa',
    due: '5 dias',
    done: false,
  },
]
