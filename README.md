# AlimRed Urbana

Plataforma web para coordinar donaciones, solicitudes, asignaciones y trazabilidad de ayuda alimentaria urbana.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + componentes estilo shadcn/ui
- Prisma ORM + SQLite
- Lucide Icons + Recharts
- next-themes (claro/oscuro)
- Leaflet + OpenStreetMap (mapa de Neiva)

## Roles y permisos
- **ADMIN:** `/panel`, `/donaciones`, `/solicitudes`, `/asignaciones`, `/historial`, `/mapa`, `/perfil`
- **DONANTE:** `/panel`, `/donaciones`, `/mapa`, `/perfil`
- **ORGANIZACION:** `/panel`, `/solicitudes`, `/mapa`, `/perfil`

## Instalación rápida
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Scripts
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
