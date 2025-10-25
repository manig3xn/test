/**
 * LocalStorage utilities with type safety and tenant/user scoping
 */

const PREFIX = "consent_platform_"

/**
 * Build scoped key for localStorage
 */
function buildKey(key: string, userId?: string, tenant?: string): string {
  const parts = [PREFIX, key]
  if (tenant) parts.push(tenant)
  if (userId) parts.push(userId)
  return parts.join("_")
}

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T, userId?: string, tenant?: string): void {
  try {
    const scopedKey = buildKey(key, userId, tenant)
    localStorage.setItem(scopedKey, JSON.stringify(data))
  } catch (error) {
    console.error("[localStorage] Failed to save:", error)
  }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage<T>(key: string, userId?: string, tenant?: string): T | null {
  try {
    const scopedKey = buildKey(key, userId, tenant)
    const item = localStorage.getItem(scopedKey)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error("[localStorage] Failed to load:", error)
    return null
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string, userId?: string, tenant?: string): void {
  try {
    const scopedKey = buildKey(key, userId, tenant)
    localStorage.removeItem(scopedKey)
  } catch (error) {
    console.error("[localStorage] Failed to remove:", error)
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("[localStorage] Failed to clear:", error)
  }
}
