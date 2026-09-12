import { Check, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import type { PortfolioAction } from '../../types/portfolio'
import { PRIORITY_META } from '../../utils/alerts'

interface ActionListProps {
  actions: PortfolioAction[]
}

function ActionList({ actions: initialActions }: ActionListProps) {
  const [actions, setActions] = useState(initialActions)

  function toggle(id: string) {
    setActions((current) =>
      current.map((action) =>
        action.id === id ? { ...action, done: !action.done } : action,
      ),
    )
  }

  return (
    <div className="rounded-2xl border border-sage-200/70 bg-white p-5 shadow-softer">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-forest-950">
          <ClipboardList className="h-4 w-4 text-forest-600" strokeWidth={2.2} />
          Próximas ações
        </h3>
        <button
          type="button"
          className="text-xs font-medium text-forest-600 transition-colors hover:text-forest-800"
        >
          Ver todas
        </button>
      </div>

      <ul className="mt-3 flex flex-col divide-y divide-sage-100">
        {actions.map((action) => {
          const priority = PRIORITY_META[action.priority]
          return (
            <li key={action.id} className="flex items-start gap-3 py-3">
              <button
                type="button"
                onClick={() => toggle(action.id)}
                aria-pressed={action.done}
                aria-label={`Marcar ação "${action.title}" como concluída`}
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  action.done
                    ? 'border-forest-500 bg-forest-500 text-white'
                    : 'border-sage-300 text-transparent hover:border-forest-400'
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    action.done ? 'text-sage-400 line-through' : 'text-forest-900'
                  }`}
                >
                  {action.title}
                </p>
                <p className="mt-0.5 text-xs text-sage-500">
                  <span className={priority.classes}>{priority.label}</span>
                  {' · '}
                  {action.due}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ActionList
