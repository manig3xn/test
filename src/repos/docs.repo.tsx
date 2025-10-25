// Documentation repository - API and integration docs
import { initSeed } from "@/utils/seed.utils"
import type { DocSection } from "./types"

export interface Doc {
  id: string
  section: DocSection
  title: string
  content: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  path?: string
  params?: Record<string, string>
  example?: string
}

// In-memory storage
let docs: Doc[] = []

/**
 * Seed documentation with static content
 */
export function seed(): void {
  initSeed()
  docs = [
    // API Documentation
    {
      id: "api-list-consents",
      section: "API",
      title: "Listar Consentimientos",
      content: "Obtiene una lista paginada de consentimientos con filtros opcionales.",
      method: "GET",
      path: "/api/v1/consents",
      params: {
        page: "Número de página (default: 1)",
        limit: "Registros por página (default: 20)",
        state: "Filtrar por estado (ACTIVE, EXPIRED, REVOKED)",
        productId: "Filtrar por producto",
      },
      example: `curl -X GET "https://api.banco.cl/v1/consents?state=ACTIVE&limit=10" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      id: "api-get-consent",
      section: "API",
      title: "Obtener Consentimiento",
      content: "Obtiene los detalles de un consentimiento específico por ID.",
      method: "GET",
      path: "/api/v1/consents/:id",
      params: {
        id: "ID del consentimiento",
      },
      example: `curl -X GET "https://api.banco.cl/v1/consents/consent-123" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      id: "api-revoke-consent",
      section: "API",
      title: "Revocar Consentimiento",
      content: "Revoca un consentimiento activo. Esta acción es irreversible.",
      method: "POST",
      path: "/api/v1/consents/:id/revoke",
      params: {
        id: "ID del consentimiento",
        reason: "Motivo de la revocación (opcional)",
      },
      example: `curl -X POST "https://api.banco.cl/v1/consents/consent-123/revoke" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"reason": "Solicitud del cliente"}'`,
    },

    // Webhook Documentation
    {
      id: "webhook-consent-created",
      section: "WEBHOOK",
      title: "Consentimiento Creado",
      content: "Se envía cuando un nuevo consentimiento es creado exitosamente.",
      method: "POST",
      path: "YOUR_WEBHOOK_URL",
      example: `{
  "event": "consent.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "consent-123",
    "person": {
      "rut": "12345678-9",
      "name": "Juan Pérez"
    },
    "productId": "cuenta-corriente",
    "state": "ACTIVE"
  }
}`,
    },
    {
      id: "webhook-consent-revoked",
      section: "WEBHOOK",
      title: "Consentimiento Revocado",
      content: "Se envía cuando un consentimiento es revocado.",
      method: "POST",
      path: "YOUR_WEBHOOK_URL",
      example: `{
  "event": "consent.revoked",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "consent-123",
    "revokedAt": "2024-01-15T10:30:00Z",
    "revokedBy": "user-456"
  }
}`,
    },

    // Integration Documentation
    {
      id: "integration-widget",
      section: "INTEGRATION",
      title: "Integración de Widget",
      content: "Guía para integrar el widget de captura de consentimientos en tu aplicación.",
      example: `<!-- Incluir el script del widget -->
<script src="https://cdn.banco.cl/consent-widget.js"></script>

<!-- Inicializar el widget -->
<script>
  ConsentWidget.init({
    widgetId: 'widget-cuenta-corriente-1',
    container: '#consent-container',
    onSuccess: (consent) => {
      console.log('Consentimiento creado:', consent);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });
</script>`,
    },
    {
      id: "integration-auth",
      section: "INTEGRATION",
      title: "Autenticación",
      content: "Todas las peticiones a la API deben incluir un token de autenticación en el header Authorization.",
      example: `Authorization: Bearer YOUR_API_TOKEN`,
    },

    // General Documentation
    {
      id: "general-overview",
      section: "GENERAL",
      title: "Visión General",
      content: `La Plataforma de Gestión de Consentimientos permite a las instituciones financieras gestionar el ciclo de vida completo de los consentimientos de sus clientes, cumpliendo con las regulaciones chilenas de protección de datos.

Características principales:
- Captura de consentimientos mediante widgets personalizables
- Gestión del ciclo de vida (creación, renovación, revocación)
- Reportes regulatorios (RDC30)
- Auditoría completa de todas las acciones
- Webhooks para integración en tiempo real
- API REST completa`,
    },
    {
      id: "general-compliance",
      section: "GENERAL",
      title: "Cumplimiento Normativo",
      content: `Esta plataforma cumple con:
- Ley 19.628 sobre Protección de la Vida Privada
- Recopilación de Datos Crediticios (RDC30)
- Normativas de la CMF (Comisión para el Mercado Financiero)

Todos los consentimientos incluyen:
- Identificación clara del titular
- Propósito específico del consentimiento
- Fecha de expiración
- Mecanismo de revocación
- Trazabilidad completa`,
    },
  ]
}

/**
 * List documentation with optional filters
 */
export function list(filter?: {
  section?: DocSection
  search?: string
}): Doc[] {
  let results = [...docs]

  if (filter) {
    if (filter.section) {
      results = results.filter((d) => d.section === filter.section)
    }

    if (filter.search) {
      const search = filter.search.toLowerCase()
      results = results.filter(
        (d) => d.title.toLowerCase().includes(search) || d.content.toLowerCase().includes(search),
      )
    }
  }

  return results
}

/**
 * Get documentation by ID
 */
export function getById(id: string): Doc | undefined {
  return docs.find((d) => d.id === id)
}

/**
 * Get documentation sections
 */
export function getSections(): DocSection[] {
  return ["API", "WEBHOOK", "INTEGRATION", "GENERAL"]
}

// Initialize seed on module load
seed()
