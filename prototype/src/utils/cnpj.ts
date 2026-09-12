export function normalizeCnpj(value: string): string {
  return value.replace(/\D/g, '').slice(0, 14)
}

export function formatCnpj(value: string): string {
  let formatted = normalizeCnpj(value)
  formatted = formatted.replace(/^(\d{2})(\d)/, '$1.$2')
  formatted = formatted.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  formatted = formatted.replace(/\.(\d{3})(\d)/, '.$1/$2')
  formatted = formatted.replace(/(\d{4})(\d)/, '$1-$2')
  return formatted
}

export function isValidCnpj(value: string): boolean {
  const digits = normalizeCnpj(value)

  if (digits.length !== 14) return false
  if (/^(\d)\1{13}$/.test(digits)) return false

  const calculateCheckDigit = (base: string, weights: number[]) => {
    const sum = base
      .split('')
      .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const base = digits.slice(0, 12)
  const firstDigit = calculateCheckDigit(base, firstWeights)
  const secondDigit = calculateCheckDigit(base + firstDigit, secondWeights)

  return digits === `${base}${firstDigit}${secondDigit}`
}
