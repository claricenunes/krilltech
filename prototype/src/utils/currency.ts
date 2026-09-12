export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

/** Formato compacto usado em destaques ("R$ 1,2 mi", "R$ 500 mil"). */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    const formatted = millions.toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })
    return `R$ ${formatted} mi`
  }

  if (value >= 1_000) {
    const thousands = Math.round(value / 1_000)
    return `R$ ${thousands} mil`
  }

  return formatCurrency(value)
}
