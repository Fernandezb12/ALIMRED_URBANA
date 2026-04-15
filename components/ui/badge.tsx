import { cn } from "@/lib/utils";

const mapas = {
  neutro: "bg-texto/10 text-texto",
  exito: "bg-exito/20 text-exito",
  alerta: "bg-alerta/20 text-alerta",
  info: "bg-info/20 text-info",
  vino: "bg-vino/20 text-vino"
};

export function Badge({
  tone = "neutro",
  className,
  children
}: {
  tone?: keyof typeof mapas;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", mapas[tone], className)}>
      {children}
    </span>
  );
}
