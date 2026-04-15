import Link from "next/link";
import { Role } from "@prisma/client";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();

  // Dashboard con métricas distintas por rol para mostrar impacto real.
  const [donacionesTotal, solicitudesTotal, atendidas, altas, actividades] = await Promise.all([
    prisma.donation.count(user.role === Role.DONANTE ? { where: { donorId: user.id } } : {}),
    prisma.request.count(user.role === Role.ORGANIZACION ? { where: { organizationId: user.id } } : {}),
    prisma.request.count({ where: { status: "ATENDIDA" } }),
    prisma.request.count({ where: { priority: "ALTA" } }),
    prisma.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })
  ]);

  const estadoDonaciones = await prisma.donation.groupBy({ by: ["status"], _count: { _all: true } });
  const chartData = estadoDonaciones.map((item) => ({ estado: item.status, total: item._count._all }));
  const porcentajeAtendido = solicitudesTotal > 0 ? Math.round((atendidas / solicitudesTotal) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard titulo="Donaciones" valor={donacionesTotal} />
        <KpiCard titulo="Solicitudes" valor={solicitudesTotal} />
        <KpiCard titulo="Prioridades altas" valor={altas} />
        <KpiCard titulo="Atención" valor={`${porcentajeAtendido}%`} extra="Porcentaje de solicitudes atendidas" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de donaciones</CardTitle>
            <CardDescription>Distribución para monitorear el flujo de entrega.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Ejecuta el flujo principal sin salir del panel.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/donaciones"><Button className="w-full">Nueva donación</Button></Link>
            <Link href="/solicitudes"><Button className="w-full" variant="outline">Nueva solicitud</Button></Link>
            {user.role === Role.ADMIN ? <Link href="/asignaciones"><Button className="w-full" variant="outline">Crear asignación</Button></Link> : null}
            <Link href="/historial"><Button className="w-full" variant="outline">Ver trazabilidad</Button></Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>Bitácora operativa de cambios críticos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actividades.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{fechaBonita(a.createdAt)}</TableCell>
                  <TableCell>{a.user.name}</TableCell>
                  <TableCell><Badge tone="vino">{a.action}</Badge></TableCell>
                  <TableCell>{a.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
