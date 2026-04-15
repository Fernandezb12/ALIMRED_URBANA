import { Role } from "@prisma/client";
import { crearAsignacionAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function AsignacionesPage() {
  await requireRole([Role.ADMIN]);

  const [donaciones, solicitudes, asignaciones] = await Promise.all([
    prisma.donation.findMany({ where: { status: "DISPONIBLE" }, orderBy: { createdAt: "asc" } }),
    prisma.request.findMany({ where: { status: { in: ["PENDIENTE", "PRIORIZADA"] } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] }),
    prisma.assignment.findMany({ include: { donation: true, request: true }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Matching de ayuda</CardTitle></CardHeader>
        <CardContent>
          <form action={crearAsignacionAction} className="grid gap-3 md:grid-cols-2">
            <Select name="donationId" required>
              <option value="">Selecciona donación disponible</option>
              {donaciones.map((d) => <option key={d.id} value={d.id}>#{d.id} · {d.resourceType} ({d.quantity})</option>)}
            </Select>
            <Select name="requestId" required>
              <option value="">Selecciona solicitud pendiente</option>
              {solicitudes.map((s) => <option key={s.id} value={s.id}>#{s.id} · {s.location} · {s.priority}</option>)}
            </Select>
            <Textarea name="notes" className="md:col-span-2" placeholder="Notas logísticas de entrega" />
            <div className="md:col-span-2"><Button type="submit">Crear asignación</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Asignaciones recientes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {asignaciones.length === 0 ? <p className="text-sm text-texto/70">No hay asignaciones todavía.</p> : asignaciones.map((a) => (
            <div key={a.id} className="rounded-xl border p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="vino">Asignación #{a.id}</Badge>
                <span>Donación #{a.donationId} → Solicitud #{a.requestId}</span>
                <span className="text-texto/70">{fechaBonita(a.createdAt)}</span>
              </div>
              <p className="mt-1 text-texto/70">{a.notes || "Sin notas."}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
