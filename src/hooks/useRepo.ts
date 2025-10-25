"use client"

// Generic repository hook
import { useState, useEffect, useCallback } from "react"

export interface RepoMethods<T> {
  data: T[]
  loading: boolean
  error: Error | null
  refresh: () => void
  list: (filter?: any) => T[]
  getById: (id: string) => T | undefined
  create?: (data: any) => T
  update?: (id: string, patch: any) => T | undefined
  remove?: (id: string) => boolean
}

/**
 * Generic hook for repository consumption
 * Wraps repository methods with React state management
 */
export function useRepo<T>(
  listFn: (filter?: any) => T[],
  getByIdFn: (id: string) => T | undefined,
  createFn?: (data: any) => T,
  updateFn?: (id: string, patch: any) => T | undefined,
  removeFn?: (id: string) => boolean,
): RepoMethods<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(() => {
    try {
      setLoading(true)
      setError(null)
      const results = listFn()
      setData(results)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [listFn])

  useEffect(() => {
    refresh()
  }, [refresh])

  const list = useCallback(
    (filter?: any) => {
      return listFn(filter)
    },
    [listFn],
  )

  const getById = useCallback(
    (id: string) => {
      return getByIdFn(id)
    },
    [getByIdFn],
  )

  const create = useCallback(
    (data: any) => {
      if (createFn) {
        const result = createFn(data)
        refresh()
        return result
      }
      return undefined
    },
    [createFn, refresh],
  )

  const update = useCallback(
    (id: string, patch: any) => {
      if (updateFn) {
        const result = updateFn(id, patch)
        refresh()
        return result
      }
      return undefined
    },
    [updateFn, refresh],
  )

  const remove = useCallback(
    (id: string) => {
      if (removeFn) {
        const result = removeFn(id)
        refresh()
        return result
      }
      return undefined
    },
    [removeFn, refresh],
  )

  return {
    data,
    loading,
    error,
    refresh,
    list,
    getById,
    create,
    update,
    remove,
  }
}
