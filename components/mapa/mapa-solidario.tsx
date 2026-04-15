"use client";

import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { tipoPuntoColor, tipoPuntoLabel } from "@/lib/constants/map-points";
import type { MapPointType } from "@/lib/domain";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Punto = {
  id: number;
  name: string;
  type: MapPointType;
  address: string;
  status: string;
  description: string;
  lat: number;
  lng: number;
};

const filtrosDisponibles: MapPointType[] = ["DONACION", "SOLICITUD", "ENTREGA", "ORGANIZACION"];

export function MapaSolidario({ puntos }: { puntos: Punto[] }) {
  const [filtro, setFiltro] = useState<MapPointType | "TODOS">("TODOS");

  const puntosFiltrados = useMemo(() => {
    if (filtro === "TODOS") return puntos;
    return puntos.filter((p) => p.type === filtro);
  }, [filtro, puntos]);

  const resumen = useMemo(
    () =>
      filtrosDisponibles.map((tipo) => ({
        tipo,
        total: puntos.filter((p) => p.type === tipo).length
      })),
    [puntos]
  );

  const icono = (tipo: MapPointType) =>
    L.divIcon({
      className: "",
      html: `<span style="display:block;width:14px;height:14px;border-radius:999px;border:2px solid white;background:${tipoPuntoColor[tipo]}"></span>`
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap gap-2 pt-5">
          <Button variant={filtro === "TODOS" ? "default" : "outline"} size="sm" onClick={() => setFiltro("TODOS")}>
            Todos
          </Button>
          {filtrosDisponibles.map((tipo) => (
            <Button key={tipo} size="sm" variant={filtro === tipo ? "default" : "outline"} onClick={() => setFiltro(tipo)}>
              {tipoPuntoLabel[tipo]}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <MapContainer center={[2.935, -75.2809]} zoom={13} className="h-[460px] w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
              {puntosFiltrados.map((punto) => (
                <Marker key={punto.id} position={[punto.lat, punto.lng]} icon={icono(punto.type)}>
                  <Popup>
                    <p className="font-semibold">{punto.name}</p>
                    <p>{tipoPuntoLabel[punto.type]}</p>
                    <p>{punto.address}</p>
                    <p><strong>Estado:</strong> {punto.status}</p>
                    <p>{punto.description}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="text-sm font-semibold">Resumen por tipo</p>
            {resumen.map((item) => (
              <div key={item.tipo} className="flex items-center justify-between rounded-xl border p-2">
                <span className="text-sm">{tipoPuntoLabel[item.tipo]}</span>
                <Badge tone="vino">{item.total}</Badge>
              </div>
            ))}
            <p className="text-xs text-texto/70">
              Mapa centrado en Neiva, Huila con puntos demo para la presentación.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
