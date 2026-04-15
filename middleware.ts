import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rutasProtegidas = ["/dashboard", "/donaciones", "/solicitudes", "/asignaciones", "/historial", "/perfil"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("alimred_sesion")?.value;
  const path = request.nextUrl.pathname;

  if (rutasProtegidas.some((ruta) => path.startsWith(ruta)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/donaciones/:path*", "/solicitudes/:path*", "/asignaciones/:path*", "/historial/:path*", "/perfil/:path*"]
};
