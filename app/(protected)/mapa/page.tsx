import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapaShell } from "@/components/mapa/mapa-shell";
import { tipoPuntoLabel } from "@/lib/constants/map-points";

export default async function MapaPage() {
  await requireUser();

  const puntos = await (prisma as any).mapPoint.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const resumen = ["DONACION", "SOLICITUD", "ENTREGA", "ORGANIZACION"].map((tipo) => ({
    tipo,
    total: puntos.filter((p: any) => p.type === tipo).length
  }));

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mapa solidario de Neiva</CardTitle>
          <CardDescription>
            Visualiza puntos de donación, solicitudes activas, entregas y organizaciones para coordinar atención urbana con contexto territorial.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {resumen.map((item) => (
            <div key={item.tipo} className="rounded-xl border p-3">
              <p className="text-xs text-texto/60">{tipoPuntoLabel[item.tipo as keyof typeof tipoPuntoLabel]}</p>
              <p className="text-2xl font-bold">{item.total}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <MapaShell puntos={puntos} />
    </div>
  );
}
