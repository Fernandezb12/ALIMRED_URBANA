import { ROLES } from "@/lib/domain";
import { crearAsignacionAction, registrarEntregaAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function AsignacionesPage() {
  await requireRole([ROLES.ADMIN]);

  const [donaciones, solicitudes, asignaciones] = await Promise.all([
    prisma.donation.findMany({ where: { status: "DISPONIBLE" }, orderBy: { createdAt: "asc" } }),
    prisma.request.findMany({ where: { status: { in: ["PENDIENTE", "PRIORIZADA"] } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] }),
    prisma.assignment.findMany({ include: { donation: true, request: true }, orderBy: { createdAt: "desc" }, take: 12 })
  ]);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Matching de ayuda</CardTitle></CardHeader>
        <CardContent>
          <form action={crearAsignacionAction} className="grid gap-3 md:grid-cols-2">
            <Select name="donationId" required>
              <option value="">Selecciona donación disponible</option>
              {donaciones.map((d: any) => <option key={d.id} value={d.id}>#{d.id} · {d.resourceType} ({d.quantity})</option>)}
            </Select>
            <Select name="requestId" required>
              <option value="">Selecciona solicitud pendiente</option>
              {solicitudes.map((s: any) => <option key={s.id} value={s.id}>#{s.id} · {s.location} · {s.priority}</option>)}
            </Select>
            <Textarea name="notes" className="md:col-span-2" placeholder="Notas logísticas de entrega" />
            <div className="md:col-span-2"><Button type="submit">Crear asignación</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Trazabilidad de entrega y evidencia</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {asignaciones.length === 0 ? <p className="text-sm text-texto/70">No hay asignaciones todavía.</p> : asignaciones.map((a: any) => (
            <div key={a.id} className="rounded-xl border p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="vino">Asignación #{a.id}</Badge>
                <span>Donación #{a.donationId} → Solicitud #{a.requestId}</span>
                <span className="text-texto/70">{fechaBonita(a.createdAt)}</span>
                {a.deliveryConfirmed ? <Badge tone="exito">Entrega confirmada</Badge> : <Badge tone="alerta">Pendiente de evidencia</Badge>}
              </div>
              <p className="mt-1 text-texto/70">{a.notes || "Sin notas."}</p>

              {a.deliveryConfirmed ? (
                <div className="mt-2 rounded-xl bg-white/5 p-2 text-xs text-texto/80">
                  <p><strong>Recibe:</strong> {a.recipientName}</p>
                  <p><strong>Fecha:</strong> {a.deliveredAt ? fechaBonita(a.deliveredAt) : "-"}</p>
                  <p><strong>Evidencia:</strong> {a.evidenceRef || "Sin referencia"}</p>
                  <p><strong>Observación:</strong> {a.deliveryNotes || "Sin observación"}</p>
                </div>
              ) : (
                <form action={registrarEntregaAction} className="mt-3 grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="assignmentId" value={a.id} />
                  <Input name="recipientName" placeholder="Nombre de quien recibe" required />
                  <Input name="deliveredAt" type="datetime-local" required />
                  <Input name="evidenceRef" placeholder="URL/foto/referencia de evidencia" className="md:col-span-2" />
                  <Textarea name="deliveryNotes" placeholder="Observación de entrega" className="md:col-span-2" />
                  <div className="md:col-span-2"><Button size="sm">Registrar evidencia de entrega</Button></div>
                </form>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
