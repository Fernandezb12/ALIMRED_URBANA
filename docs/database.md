# Base de datos (SQLite + Prisma)

## Modelos principales
- `User`
- `OrganizationProfile`
- `Donation`
- `Request` (incluye prioridad sugerida y explicación)
- `Assignment` (incluye evidencia de entrega)
- `ActivityLog`
- `Session`
- `MapPoint` (puntos del mapa solidario en Neiva)

## Estados
- Donación: `DISPONIBLE`, `ASIGNADA`, `ENTREGADA`
- Solicitud: `PENDIENTE`, `PRIORIZADA`, `ATENDIDA`, `CERRADA`
- Prioridad: `ALTA`, `MEDIA`, `BAJA`
