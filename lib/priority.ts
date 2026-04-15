import { type Priority, type Urgency, PRIORITY, URGENCY } from "@/lib/domain";

// Motor de prioridad sugerida basado en reglas para demo explicable.
export function sugerirPrioridad(params: {
  urgencia: Urgency;
  cantidad: number;
  vulnerableGroup: boolean;
  unattendedHours: number;
  needType: string;
}): { priority: Priority; reason: string } {
  const { urgencia, cantidad, vulnerableGroup, unattendedHours, needType } = params;

  let score = 0;
  const motivos: string[] = [];

  if (urgencia === URGENCY.ALTA) {
    score += 4;
    motivos.push("urgencia alta declarada");
  } else if (urgencia === URGENCY.MEDIA) {
    score += 2;
    motivos.push("urgencia media");
  }

  if (cantidad >= 100) {
    score += 2;
    motivos.push("alta cantidad requerida");
  }

  if (vulnerableGroup) {
    score += 2;
    motivos.push("incluye población vulnerable");
  }

  if (unattendedHours >= 48) {
    score += 2;
    motivos.push("más de 48h sin atención");
  }

  if (["INFANTIL", "ADULTO_MAYOR"].includes(needType)) {
    score += 1;
    motivos.push("tipo de necesidad sensible");
  }

  if (score >= 6) return { priority: PRIORITY.ALTA, reason: motivos.join(", ") };
  if (score >= 3) return { priority: PRIORITY.MEDIA, reason: motivos.join(", ") };
  return { priority: PRIORITY.BAJA, reason: motivos.join(", ") || "sin indicadores críticos" };
}

// Compatibilidad con lógica previa.
export function calcularPrioridad(urgencia: Urgency, cantidad: number): Priority {
  return sugerirPrioridad({
    urgencia,
    cantidad,
    vulnerableGroup: false,
    unattendedHours: 0,
    needType: "GENERAL"
  }).priority;
}
