"use client";

import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { tipoPuntoColor, tipoPuntoLabel } from "@/lib/constants/map-points";
import type { MapPointType } from "@/lib/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      html: `<span style="display:block;position:relative;width:16px;height:16px;border-radius:999px;border:2px solid white;background:${tipoPuntoColor[tipo]};box-shadow:0 0 0 6px ${tipoPuntoColor[tipo]}33"></span>`
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filtros operativos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-2">
          <Button variant={filtro === "TODOS" ? "default" : "outline"} size="sm" onClick={() => setFiltro("TODOS")}>
            Todos
          </Button>
          {filtrosDisponibles.map((tipo) => (
            <Button key={tipo} size="sm" variant={filtro === tipo ? "default" : "outline"} onClick={() => setFiltro(tipo)}>
              {tipoPuntoLabel[tipo]}
            </Button>
          ))}
          <Badge tone="info" className="ml-auto">Puntos visibles: {puntosFiltrados.length}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr,320px]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <MapContainer center={[2.935, -75.2809]} zoom={13} className="h-[540px] w-full md:h-[620px]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
              {puntosFiltrados.map((punto) => (
                <Marker key={punto.id} position={[punto.lat, punto.lng]} icon={icono(punto.type)}>
                  <Popup>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold">{punto.name}</p>
                      <p><strong>Tipo:</strong> {tipoPuntoLabel[punto.type]}</p>
                      <p><strong>Estado:</strong> {punto.status}</p>
                      <p><strong>Referencia:</strong> {punto.address}</p>
                      <p>{punto.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Puntos activos en Neiva</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-2">
              {resumen.map((item) => (
                <div key={item.tipo} className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoPuntoColor[item.tipo] }} />
                    <span className="text-sm">{tipoPuntoLabel[item.tipo]}</span>
                  </div>
                  <Badge tone="vino">{item.total}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Leyenda y uso</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs text-texto/75 pt-2">
              <p>• Azul: donaciones disponibles para asignar.</p>
              <p>• Rojo: solicitudes activas con necesidad de atención.</p>
              <p>• Verde: puntos de entrega y cierre logístico.</p>
              <p>• Morado: organizaciones y nodos comunitarios.</p>
              <p className="rounded-lg border p-2 text-[11px]">
                Consejo demo: aplica filtros para mostrar la narrativa territorial por tipo de intervención.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
