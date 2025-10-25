"use client"

// Consumer repository hook
import { useCallback } from "react"
import * as consumerRepo from "@/repos/consumer.repo"

export function useConsumerRepo() {
  const getByRut = useCallback((rut: string) => {
    return consumerRepo.getByRut(rut)
  }, [])

  const getByEmail = useCallback((email: string) => {
    return consumerRepo.getByEmail(email)
  }, [])

  const authenticate = useCallback((rut: string, email: string) => {
    return consumerRepo.authenticate(rut, email)
  }, [])

  return {
    getByRut,
    getByEmail,
    authenticate,
  }
}
