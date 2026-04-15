import { Priority, Urgency } from "@prisma/client";

// Reglas visibles y simples para clasificar atención.
export function calcularPrioridad(urgencia: Urgency, cantidad: number): Priority {
  if (urgencia === "ALTA") return "ALTA";
  if (urgencia === "MEDIA" && cantidad > 90) return "ALTA";
  if (urgencia === "MEDIA") return "MEDIA";
  if (cantidad > 120) return "MEDIA";
  return "BAJA";
}
