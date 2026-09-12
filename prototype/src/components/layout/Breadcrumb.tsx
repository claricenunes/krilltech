import { Link } from 'react-router-dom'

type BreadcrumbItem = {
  label: string
  to?: string
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6 text-sm text-stone-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={item.label}>
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-emerald-800 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-stone-700' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="mx-2 text-stone-300">/</span>}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
export type { BreadcrumbItem }
