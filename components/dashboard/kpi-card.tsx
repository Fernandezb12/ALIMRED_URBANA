import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ titulo, valor, extra }: { titulo: string; valor: string | number; extra?: string }) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-5">
        <p className="text-sm text-texto/70">{titulo}</p>
        <p className="text-3xl font-bold">{valor}</p>
        {extra ? <p className="text-xs text-texto/60">{extra}</p> : null}
      </CardContent>
    </Card>
  );
}
