import Link from "next/link";
import { Gift, ClipboardList, Link2, User, LogOut, MapPinned, LayoutDashboard, ShieldCheck } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { roleLabel, type SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";

const menuPorRol = {
  ADMIN: [
    { href: "/panel", label: "Panel", icon: LayoutDashboard },
    { href: "/donaciones", label: "Donaciones", icon: Gift },
    { href: "/solicitudes", label: "Solicitudes", icon: ClipboardList },
    { href: "/asignaciones", label: "Asignaciones", icon: Link2 },
    { href: "/historial", label: "Historial", icon: ShieldCheck },
    { href: "/mapa", label: "Mapa solidario", icon: MapPinned },
    { href: "/perfil", label: "Perfil", icon: User }
  ],
  DONANTE: [
    { href: "/panel", label: "Mi panel", icon: LayoutDashboard },
    { href: "/donaciones", label: "Mis donaciones", icon: Gift },
    { href: "/mapa", label: "Mapa solidario", icon: MapPinned },
    { href: "/perfil", label: "Perfil", icon: User }
  ],
  ORGANIZACION: [
    { href: "/panel", label: "Mi panel", icon: LayoutDashboard },
    { href: "/solicitudes", label: "Mis solicitudes", icon: ClipboardList },
    { href: "/mapa", label: "Mapa solidario", icon: MapPinned },
    { href: "/perfil", label: "Perfil", icon: User }
  ]
} as const;

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const menu = menuPorRol[user.role as keyof typeof menuPorRol];

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[250px,1fr] md:p-6">
        <aside className="rounded-2xl border bg-panel p-4 shadow-suave">
          <p className="text-lg font-bold text-vino">AlimRed Urbana</p>
          <p className="mt-1 text-xs text-texto/70">{roleLabel(user.role)} · Experiencia segmentada</p>
          <nav className="mt-6 space-y-1">
            {menu.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-6">
            <Button type="submit" variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </form>
        </aside>

        <div className="space-y-5">
          <header className="flex items-center justify-between rounded-2xl border bg-panel p-4 shadow-suave">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-texto/70">{user.email} · {roleLabel(user.role)}</p>
            </div>
            <ThemeToggle />
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
