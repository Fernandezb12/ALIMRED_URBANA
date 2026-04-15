import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { fechaBonita } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function HistorialPage() {
  await requireUser();
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: true }
  });

  return (
    <Card>
      <CardHeader><CardTitle>Trazabilidad y actividad</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {logs.length === 0 ? <p className="text-sm text-texto/70">No hay actividad registrada.</p> : logs.map((log) => (
          <div key={log.id} className="rounded-xl border p-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge tone="vino">{log.action}</Badge>
              <span className="font-medium">{log.user.name}</span>
              <span className="text-texto/60">{fechaBonita(log.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-texto/75">{log.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
