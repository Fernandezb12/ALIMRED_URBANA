"use client";

import dynamic from "next/dynamic";

const MapaSolidario = dynamic(() => import("@/components/mapa/mapa-solidario").then((m) => m.MapaSolidario), {
  ssr: false
});

type Punto = {
  id: number;
  name: string;
  type: "DONACION" | "SOLICITUD" | "ENTREGA" | "ORGANIZACION";
  address: string;
  status: string;
  description: string;
  lat: number;
  lng: number;
};

export function MapaShell({ puntos }: { puntos: Punto[] }) {
  return <MapaSolidario puntos={puntos} />;
}
