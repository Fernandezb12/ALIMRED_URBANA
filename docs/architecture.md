# Arquitectura

AlimRed Urbana usa una arquitectura fullstack en Next.js App Router:

- **UI Server Components** para listar datos y construir dashboards.
- **Server Actions** para crear/editar donaciones, solicitudes, prioridad, asignaciones y perfil.
- **Autenticación interna** por cookie httpOnly + tabla `Session`.
- **Control por rol** (`ADMIN`, `DONANTE`, `ORGANIZACION`) desde `lib/auth.ts`.
- **Prisma + SQLite** para persistencia local y demo sin servicios externos.
