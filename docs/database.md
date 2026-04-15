# Base de datos (SQLite + Prisma)

## Modelos principales
- `User`: usuarios y roles.
- `OrganizationProfile`: datos extra de organización.
- `Donation`: recursos donados y estado.
- `Request`: solicitudes de ayuda y prioridad.
- `Assignment`: vincula donaciones con solicitudes.
- `ActivityLog`: trazabilidad del sistema.
- `Session`: sesiones activas para login local.

## Estados
- Donación: `DISPONIBLE`, `ASIGNADA`, `ENTREGADA`
- Solicitud: `PENDIENTE`, `PRIORIZADA`, `ATENDIDA`, `CERRADA`
- Prioridad: `ALTA`, `MEDIA`, `BAJA`
