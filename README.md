# AlimRed Urbana

Aplicación web para coordinar **donaciones**, **solicitudes de ayuda** y **asignaciones** con trazabilidad completa en zonas urbanas.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + componentes estilo shadcn/ui
- Prisma ORM + SQLite local
- Lucide Icons
- Recharts
- next-themes (modo claro/oscuro)

## Instalación rápida
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Scripts útiles
```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:seed
npm run db:reset
```

## Credenciales demo
- `admin@alimred.local / Admin123*`
- `donante@alimred.local / Donante123*`
- `organizacion@alimred.local / Organizacion123*`

## Estructura base
- `app/` rutas y vistas (landing, login, paneles)
- `components/` UI, layout y widgets de dashboard
- `lib/` auth, prisma, utilidades, prioridad
- `prisma/` schema + seed
- `docs/` arquitectura, flujos y modelo de datos

## Capturas
Pendiente: agregar capturas de demo (`/docs/screenshots`).
