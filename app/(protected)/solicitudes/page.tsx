import { ROLES } from "@/lib/domain";
import { actualizarSolicitudAction, crearSolicitudAction, priorizarSolicitudAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function SolicitudesPage() {
  const user = await requireRole([ROLES.ORGANIZACION, ROLES.ADMIN]);
  const solicitudes = await prisma.request.findMany({
    where: user.role === ROLES.ADMIN ? {} : { organizationId: user.id },
    include: { organization: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Registrar solicitud</CardTitle></CardHeader>
        <CardContent>
          <form action={crearSolicitudAction} className="grid gap-3 md:grid-cols-2">
            <Input name="quantity" type="number" min={1} placeholder="Cantidad requerida" required />
            <Input name="location" placeholder="Ubicación o referencia" required />
            <Select name="urgency" defaultValue="MEDIA">
              <option value="ALTA">Urgencia alta</option>
              <option value="MEDIA">Urgencia media</option>
              <option value="BAJA">Urgencia baja</option>
            </Select>
            <Textarea name="description" placeholder="Necesidad alimentaria detectada" className="md:col-span-2" required />
            <div className="md:col-span-2"><Button type="submit">Guardar solicitud</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Listado de solicitudes</CardTitle></CardHeader>
        <CardContent>
          {solicitudes.length === 0 ? <p className="text-sm text-texto/70">Aún no hay solicitudes registradas.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitud</TableHead><TableHead>Prioridad</TableHead><TableHead>Estado</TableHead><TableHead>Org.</TableHead><TableHead>Fecha</TableHead><TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.description}<div className="text-xs text-texto/70">{s.location} · {s.quantity} unidades</div></TableCell>
                    <TableCell><Badge tone={s.priority === "ALTA" ? "alerta" : s.priority === "MEDIA" ? "info" : "neutro"}>{s.priority}</Badge></TableCell>
                    <TableCell><Badge tone={s.status === "ATENDIDA" ? "exito" : "vino"}>{s.status}</Badge></TableCell>
                    <TableCell>{s.organization.name}</TableCell>
                    <TableCell>{fechaBonita(s.createdAt)}</TableCell>
                    <TableCell className="space-y-2">
                      <form action={actualizarSolicitudAction} className="flex flex-wrap gap-2">
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="description" value={s.description} />
                        <input type="hidden" name="quantity" value={s.quantity} />
                        <input type="hidden" name="urgency" value={s.urgency} />
                        <Select name="status" defaultValue={s.status} className="h-9 w-36">
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="PRIORIZADA">PRIORIZADA</option>
                          <option value="ATENDIDA">ATENDIDA</option>
                          <option value="CERRADA">CERRADA</option>
                        </Select>
                        <Button size="sm" variant="outline">Estado</Button>
                      </form>
                      {user.role === ROLES.ADMIN ? (
                        <form action={priorizarSolicitudAction} className="flex gap-2">
                          <input type="hidden" name="id" value={s.id} />
                          <Select name="priority" defaultValue={s.priority} className="h-9 w-36">
                            <option value="ALTA">ALTA</option>
                            <option value="MEDIA">MEDIA</option>
                            <option value="BAJA">BAJA</option>
                          </Select>
                          <Button size="sm">Priorizar</Button>
                        </form>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
