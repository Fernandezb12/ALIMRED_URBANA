import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapaShell } from "@/components/mapa/mapa-shell";

export default async function MapaPage() {
  await requireUser();

  const puntos = await (prisma as any).mapPoint.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Mapa solidario de Neiva</CardTitle>
          <CardDescription>Visualiza donaciones, solicitudes, entregas y organizaciones de apoyo.</CardDescription>
        </CardHeader>
        <CardContent>
          <MapaShell puntos={puntos} />
        </CardContent>
      </Card>
    </div>
  );
}
