import Link from "next/link";
import { ArrowRight, HandHeart, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypewriterHero } from "@/components/typewriter-hero";

const beneficios = [
  { icono: HandHeart, titulo: "Canaliza donaciones reales", texto: "Convierte oferta dispersa en ayuda útil y trazable." },
  { icono: Workflow, titulo: "Conecta oferta y demanda", texto: "Prioriza solicitudes y asigna recursos con criterio." },
  { icono: ShieldCheck, titulo: "Seguimiento transparente", texto: "Cada acción deja rastro para auditoría y mejora continua." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen gradiente-hero">
      <header className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <p className="text-lg font-bold">AlimRed Urbana</p>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button>Ingresar</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-vino/10 px-3 py-1 text-xs font-semibold text-vino">
            <Sparkles className="h-3.5 w-3.5" /> Prototipo social para hackathon
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Red inteligente para{" "}
            <span className="text-vino">
              <TypewriterHero
                frases={[
                  "combatir hambre urbana",
                  "coordinar donaciones reales",
                  "priorizar ayudas urgentes",
                  "conectar apoyo social"
                ]}
              />
            </span>{" "}
            con datos y acción.
          </h1>
          <p className="max-w-xl text-texto/75">
            AlimRed Urbana coordina donantes, organizaciones y equipos de gestión para reducir tiempos de atención y mejorar el impacto.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Iniciar sesión <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Card className="border-vino/20">
          <CardHeader>
            <CardTitle>Cómo funciona</CardTitle>
            <CardDescription>Flujo principal visible en menos de 5 minutos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p><strong>1.</strong> Donante registra recursos alimentarios.</p>
            <p><strong>2.</strong> Organización publica solicitud de ayuda.</p>
            <p><strong>3.</strong> Admin prioriza, asigna y actualiza estados.</p>
            <p><strong>4.</strong> Dashboard refleja métricas e historial en tiempo real.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-3">
        {beneficios.map((item) => (
          <Card key={item.titulo}>
            <CardHeader>
              <item.icono className="mb-2 h-5 w-5 text-vino" />
              <CardTitle>{item.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-texto/75">{item.texto}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
