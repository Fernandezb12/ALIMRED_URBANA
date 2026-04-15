import Link from "next/link";
import { Home, Gift, ClipboardList, Link2, History, User, LogOut } from "lucide-react";
import { Role } from "@prisma/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { roleLabel, type SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";

const menuBase = [
  { href: "/dashboard", label: "Panel", icon: Home },
  { href: "/donaciones", label: "Donaciones", icon: Gift },
  { href: "/solicitudes", label: "Solicitudes", icon: ClipboardList },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/perfil", label: "Perfil", icon: User }
];

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const menu = user.role === Role.ADMIN ? [...menuBase.slice(0, 3), { href: "/asignaciones", label: "Asignaciones", icon: Link2 }, ...menuBase.slice(3)] : menuBase;

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[220px,1fr] md:p-6">
        <aside className="rounded-2xl border bg-panel p-4 shadow-suave">
          <p className="text-lg font-bold text-vino">AlimRed Urbana</p>
          <p className="mt-1 text-xs text-texto/70">{roleLabel(user.role)}</p>
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
              <p className="font-semibold">Hola, {user.name}</p>
              <p className="text-sm text-texto/70">{user.email}</p>
            </div>
            <ThemeToggle />
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
