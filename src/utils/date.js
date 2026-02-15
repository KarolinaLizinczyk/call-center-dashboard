export function formatDisplayDate(value, locale = 'pl-PL') {
  if (!value) return '-'

  const date = new Date(value)

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
