import type { RegionRisk } from '../../types/portfolio'

const LEVEL_COLORS: Record<RegionRisk['level'], string> = {
  alto: '#d94a3a',
  medio: '#dd8a34',
  baixo: '#86a181',
  none: '#dde8d5',
}

const REGION_PATHS: Record<string, string> = {
  Norte: 'M42 18 L196 12 L228 58 L206 112 L146 132 L66 120 L28 78 Z',
  Nordeste: 'M196 12 L266 38 L288 108 L248 142 L206 112 L228 58 Z',
  'Centro-Oeste': 'M66 120 L146 132 L206 112 L248 142 L218 210 L138 222 L88 190 Z',
  Sudeste: 'M138 222 L218 210 L244 250 L198 276 L154 266 Z',
  Sul: 'M154 266 L198 276 L188 312 L148 316 L128 290 Z',
}

interface RegionalRiskMapProps {
  regions: RegionRisk[]
}

function RegionalRiskMap({ regions }: RegionalRiskMapProps) {
  const byRegion = new Map(regions.map((region) => [region.region, region]))

  return (
    <div className="flex flex-col gap-6 @sm:flex-row @sm:items-center">
      <svg
        viewBox="0 0 300 330"
        className="h-56 w-full max-w-[220px] flex-shrink-0 self-center"
        aria-hidden="true"
      >
        {Object.entries(REGION_PATHS).map(([name, d]) => {
          const region = byRegion.get(name)
          const color = LEVEL_COLORS[region?.level ?? 'none']
          return (
            <path
              key={name}
              d={d}
              fill={color}
              stroke="#f8f6ee"
              strokeWidth={3}
              strokeLinejoin="round"
              className="transition-opacity duration-200 hover:opacity-80"
            >
              <title>
                {name} — {region?.clients ?? 0} cliente(s) em atenção
              </title>
            </path>
          )
        })}
      </svg>

      <ul className="flex flex-1 flex-col gap-3">
        {regions.map((region) => (
          <li key={region.region} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-forest-900">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: LEVEL_COLORS[region.level] }}
              />
              {region.region}
            </span>
            <span className="text-sage-500">
              {region.clients} {region.clients === 1 ? 'cliente' : 'clientes'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RegionalRiskMap
