/**
 * Date formatting utilities for RDC30 compliance
 */

/**
 * Format date to RDC30 format: AAAAMMDD
 */
export function formatRDCDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

/**
 * Format time to RDC30 format: HHMMSS
 */
export function formatRDCTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")
  return `${hours}${minutes}${seconds}`
}

/**
 * Parse RDC30 date format (AAAAMMDD) to Date
 */
export function parseRDCDate(rdcDate: string): Date {
  const year = Number.parseInt(rdcDate.substring(0, 4))
  const month = Number.parseInt(rdcDate.substring(4, 6)) - 1
  const day = Number.parseInt(rdcDate.substring(6, 8))
  return new Date(year, month, day)
}

/**
 * Parse RDC30 time format (HHMMSS) and apply to date
 */
export function parseRDCTime(rdcTime: string, baseDate: Date = new Date()): Date {
  const hours = Number.parseInt(rdcTime.substring(0, 2))
  const minutes = Number.parseInt(rdcTime.substring(2, 4))
  const seconds = Number.parseInt(rdcTime.substring(4, 6))
  const date = new Date(baseDate)
  date.setHours(hours, minutes, seconds, 0)
  return date
}

/**
 * Format date for display (DD/MM/YYYY)
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format datetime for display (DD/MM/YYYY HH:MM)
 */
export function formatDisplayDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const dateStr = formatDisplayDate(d)
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${dateStr} ${hours}:${minutes}`
}

/**
 * Get relative time string (e.g., "hace 2 días")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

/**
 * Calculate days until expiration
 */
export function daysUntilExpiration(expiryDate: Date | string): number {
  const d = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
