import { Role } from "@prisma/client";
import { actualizarDonacionAction, crearDonacionAction } from "@/app/actions";
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

export default async function DonacionesPage() {
  const user = await requireRole([Role.DONANTE, Role.ADMIN]);
  const donaciones = await prisma.donation.findMany({
    where: user.role === Role.ADMIN ? {} : { donorId: user.id },
    include: { donor: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Registrar donación</CardTitle></CardHeader>
        <CardContent>
          <form action={crearDonacionAction} className="grid gap-3 md:grid-cols-2">
            <Input name="resourceType" placeholder="Tipo de recurso (ej. Arroz, leche)" required />
            <Input name="quantity" type="number" min={1} placeholder="Cantidad" required />
            <Textarea name="description" placeholder="Descripción del lote donado" className="md:col-span-2" required />
            <Input name="notes" placeholder="Observación opcional" className="md:col-span-2" />
            <div className="md:col-span-2"><Button type="submit">Guardar donación</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Listado de donaciones</CardTitle></CardHeader>
        <CardContent>
          {donaciones.length === 0 ? <p className="text-sm text-texto/70">Aún no hay donaciones registradas.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recurso</TableHead><TableHead>Cantidad</TableHead><TableHead>Estado</TableHead><TableHead>Responsable</TableHead><TableHead>Fecha</TableHead><TableHead>Editar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donaciones.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.resourceType}<div className="text-xs text-texto/70">{d.description}</div></TableCell>
                    <TableCell>{d.quantity}</TableCell>
                    <TableCell><Badge tone={d.status === "DISPONIBLE" ? "info" : d.status === "ASIGNADA" ? "alerta" : "exito"}>{d.status}</Badge></TableCell>
                    <TableCell>{d.donor.name}</TableCell>
                    <TableCell>{fechaBonita(d.createdAt)}</TableCell>
                    <TableCell>
                      <form action={actualizarDonacionAction} className="flex gap-2">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="description" value={d.description} />
                        <input type="hidden" name="quantity" value={d.quantity} />
                        <Select name="status" defaultValue={d.status} className="h-9 w-36">
                          <option value="DISPONIBLE">DISPONIBLE</option>
                          <option value="ASIGNADA">ASIGNADA</option>
                          <option value="ENTREGADA">ENTREGADA</option>
                        </Select>
                        <Button size="sm" variant="outline">Actualizar</Button>
                      </form>
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
