import Link from "next/link";
import { ROLES } from "@/lib/domain";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function PanelPage() {
  const user = await requireUser();

  if (user.role === ROLES.ADMIN) return <AdminPanel userId={user.id} />;
  if (user.role === ROLES.DONANTE) return <DonantePanel userId={user.id} />;
  return <OrganizacionPanel userId={user.id} />;
}

async function AdminPanel({ userId }: { userId: number }) {
  const [donacionesTotal, solicitudesTotal, atendidas, altas, actividades] = await Promise.all([
    prisma.donation.count(),
    prisma.request.count(),
    prisma.request.count({ where: { status: "ATENDIDA" } }),
    prisma.request.count({ where: { priority: "ALTA" } }),
    prisma.activityLog.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: true } })
  ]);

  const estadoDonaciones = await prisma.donation.groupBy({ by: ["status"], _count: { _all: true } });
  const chartData = estadoDonaciones.map((item: any) => ({ estado: item.status, total: item._count._all }));
  const porcentajeAtendido = solicitudesTotal > 0 ? Math.round((atendidas / solicitudesTotal) * 100) : 0;

  return (
    <div className="space-y-5">
      <PanelHeader titulo="Panel de coordinación general" subtitulo="Visión integral del ecosistema AlimRed Urbana." rol="ADMIN" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard titulo="Donaciones totales" valor={donacionesTotal} />
        <KpiCard titulo="Solicitudes totales" valor={solicitudesTotal} />
        <KpiCard titulo="Prioridades altas" valor={altas} />
        <KpiCard titulo="Atención global" valor={`${porcentajeAtendido}%`} extra="Solicitudes atendidas" />
      </div>
      <AccesosRapidos links={["/donaciones", "/solicitudes", "/asignaciones", "/historial", "/mapa"]} />
      <Card>
        <CardHeader><CardTitle>Comportamiento de donaciones</CardTitle><CardDescription>Estado operativo del inventario solidario.</CardDescription></CardHeader>
        <CardContent><StatusChart data={chartData} /></CardContent>
      </Card>
      <ActividadTabla actividades={actividades.map((a: any) => ({ id: a.id, fecha: a.createdAt, actor: a.user.name, accion: a.action, detalle: a.detail }))} />
    </div>
  );
}

async function DonantePanel({ userId }: { userId: number }) {
  const [total, disponibles, asignadas, entregadas, donaciones] = await Promise.all([
    prisma.donation.count({ where: { donorId: userId } }),
    prisma.donation.count({ where: { donorId: userId, status: "DISPONIBLE" } }),
    prisma.donation.count({ where: { donorId: userId, status: "ASIGNADA" } }),
    prisma.donation.count({ where: { donorId: userId, status: "ENTREGADA" } }),
    prisma.donation.findMany({ where: { donorId: userId }, orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  const chartData = [
    { estado: "DISPONIBLE", total: disponibles },
    { estado: "ASIGNADA", total: asignadas },
    { estado: "ENTREGADA", total: entregadas }
  ];

  return (
    <div className="space-y-5">
      <PanelHeader titulo="Panel del donante" subtitulo="Monitorea el impacto de tus aportes alimentarios." rol="DONANTE" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard titulo="Mis donaciones" valor={total} />
        <KpiCard titulo="Disponibles" valor={disponibles} />
        <KpiCard titulo="Asignadas" valor={asignadas} />
        <KpiCard titulo="Entregadas" valor={entregadas} />
      </div>
      <AccesosRapidos links={["/donaciones", "/mapa", "/perfil"]} />
      <Card>
        <CardHeader><CardTitle>Estado de mis donaciones</CardTitle></CardHeader>
        <CardContent><StatusChart data={chartData} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Actividad reciente de mis aportes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {donaciones.length === 0 ? <p className="text-sm text-texto/70">Aún no registras donaciones.</p> : donaciones.map((d: any) => (
            <div key={d.id} className="rounded-xl border p-3 text-sm">
              <p className="font-medium">{d.resourceType} · {d.quantity} unidades</p>
              <p className="text-texto/70">{d.description}</p>
              <div className="mt-1 flex items-center gap-2"><Badge tone="info">{d.status}</Badge><span className="text-xs text-texto/60">{fechaBonita(d.createdAt)}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function OrganizacionPanel({ userId }: { userId: number }) {
  const [total, pendientes, priorizadas, atendidas, solicitudes] = await Promise.all([
    prisma.request.count({ where: { organizationId: userId } }),
    prisma.request.count({ where: { organizationId: userId, status: "PENDIENTE" } }),
    prisma.request.count({ where: { organizationId: userId, status: "PRIORIZADA" } }),
    prisma.request.count({ where: { organizationId: userId, status: "ATENDIDA" } }),
    prisma.request.findMany({ where: { organizationId: userId }, orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  const chartData = [
    { estado: "PENDIENTE", total: pendientes },
    { estado: "PRIORIZADA", total: priorizadas },
    { estado: "ATENDIDA", total: atendidas }
  ];

  return (
    <div className="space-y-5">
      <PanelHeader titulo="Panel de organización" subtitulo="Gestiona solicitudes y seguimiento de atención." rol="ORGANIZACION" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard titulo="Mis solicitudes" valor={total} />
        <KpiCard titulo="Pendientes" valor={pendientes} />
        <KpiCard titulo="Priorizadas" valor={priorizadas} />
        <KpiCard titulo="Atendidas" valor={atendidas} />
      </div>
      <AccesosRapidos links={["/solicitudes", "/mapa", "/perfil"]} />
      <Card>
        <CardHeader><CardTitle>Seguimiento de solicitudes</CardTitle></CardHeader>
        <CardContent><StatusChart data={chartData} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Actividad reciente de mis casos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {solicitudes.length === 0 ? <p className="text-sm text-texto/70">Aún no registras solicitudes.</p> : solicitudes.map((s: any) => (
            <div key={s.id} className="rounded-xl border p-3 text-sm">
              <p className="font-medium">{s.location} · {s.quantity} unidades</p>
              <p className="text-texto/70">{s.description}</p>
              <div className="mt-1 flex items-center gap-2"><Badge tone="alerta">{s.status}</Badge><span className="text-xs text-texto/60">{fechaBonita(s.createdAt)}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PanelHeader({ titulo, subtitulo, rol }: { titulo: string; subtitulo: string; rol: string }) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
        <div>
          <h1 className="text-2xl font-bold">{titulo}</h1>
          <p className="text-sm text-texto/70">{subtitulo}</p>
        </div>
        <Badge tone="vino">Rol activo: {rol}</Badge>
      </CardContent>
    </Card>
  );
}

function AccesosRapidos({ links }: { links: string[] }) {
  const mapa: Record<string, string> = {
    "/donaciones": "Nueva donación",
    "/solicitudes": "Nueva solicitud",
    "/asignaciones": "Crear asignación",
    "/historial": "Ver trazabilidad",
    "/mapa": "Abrir mapa",
    "/perfil": "Mi perfil"
  };

  return (
    <Card>
      <CardHeader><CardTitle>Accesos rápidos</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((href) => (
          <Link key={href} href={href}><Button className="w-full" variant={href === "/asignaciones" ? "outline" : "default"}>{mapa[href]}</Button></Link>
        ))}
      </CardContent>
    </Card>
  );
}

function ActividadTabla({ actividades }: { actividades: { id: number; fecha: Date; actor: string; accion: string; detalle: string }[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Actividad reciente del sistema</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Actor</TableHead><TableHead>Acción</TableHead><TableHead>Detalle</TableHead></TableRow></TableHeader>
          <TableBody>
            {actividades.map((a: any) => (
              <TableRow key={a.id}><TableCell>{fechaBonita(a.fecha)}</TableCell><TableCell>{a.actor}</TableCell><TableCell><Badge tone="vino">{a.accion}</Badge></TableCell><TableCell>{a.detalle}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
