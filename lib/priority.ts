import { type Priority, type Urgency, PRIORITY, URGENCY } from "@/lib/domain";

// Reglas visibles y simples para clasificar atención.
export function calcularPrioridad(urgencia: Urgency, cantidad: number): Priority {
  if (urgencia === URGENCY.ALTA) return PRIORITY.ALTA;
  if (urgencia === URGENCY.MEDIA && cantidad > 90) return PRIORITY.ALTA;
  if (urgencia === URGENCY.MEDIA) return PRIORITY.MEDIA;
  if (cantidad > 120) return PRIORITY.MEDIA;
  return PRIORITY.BAJA;
}
