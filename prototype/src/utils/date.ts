export function formatDate(iso: string): string {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return iso
  return data.toLocaleDateString('pt-BR')
}
