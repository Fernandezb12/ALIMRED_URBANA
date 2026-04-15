import type { MapPointType } from "@/lib/domain";

export const tipoPuntoLabel: Record<MapPointType, string> = {
  DONACION: "Donaciones",
  SOLICITUD: "Solicitudes",
  ENTREGA: "Entregas",
  ORGANIZACION: "Organizaciones"
};

export const tipoPuntoColor: Record<MapPointType, string> = {
  DONACION: "#2563eb",
  SOLICITUD: "#dc2626",
  ENTREGA: "#16a34a",
  ORGANIZACION: "#7c3aed"
};
