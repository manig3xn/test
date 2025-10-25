// Shared types and enums for all repositories

export type Role = "ADMIN" | "OPS" | "MANDATARY"

export type ConsentState = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "REVOKED"

export type ConsentMedium = "ELECTRONIC" | "VERBAL" | "WRITTEN"

export type ConsentPurpose = "RISK_COMMERCIAL" | "RISK_CREDIT"

export type ConsentObjective =
  | "CREDITO_COMERCIAL"
  | "CONSUMO"
  | "VIVIENDA"
  | "FINANCIERO"
  | "INSTRUMENTO_DEUDA"
  | "CONTINGENTE"
  | "LINEA_LIBRE"

export type JobStatus = "QUEUED" | "RUNNING" | "SUCCESS" | "ERROR"

export type JobType = "IMPORT" | "EXPORT"

export type TcStatus = "DRAFT" | "PUBLISHED"

export type AlertType = "EXPIRING_SOON" | "EXPIRED" | "UNUSUAL_REVOKE" | "JOB_ERROR" | "WEBHOOK_FAIL"

export type AlertState = "OPEN" | "ACK"

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "REVOKE" | "EXPORT" | "IMPORT" | "LOGIN" | "LOGOUT"

export type ResourceType = "CONSENT" | "TC" | "WIDGET" | "USER" | "JOB" | "ALERT" | "REPORT"

export type ReportType = "RDC30"

export type Channel = "WEB" | "MOBILE" | "BRANCH" | "CALL_CENTER"

export type DocSection = "API" | "WEBHOOK" | "INTEGRATION" | "GENERAL"

// Common interfaces
export interface Timestamps {
  createdAt: string
  updatedAt?: string
}

export interface Person {
  rut: string
  name: string
  email: string
}

export interface RDC30Timestamps {
  otorgamientoFecha: string // AAAAMMDD
  otorgamientoHora: string // HHMMSS
  finFecha?: string // AAAAMMDD
  finHora?: string // HHMMSS
  revokedAt?: string // ISO string
}
