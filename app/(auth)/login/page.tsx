import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-5 gradiente-hero">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede al panel de coordinación de AlimRed Urbana.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-5 text-center text-xs text-texto/65">
            ¿Primera vez? Usa cuentas demo del README. <Link href="/" className="text-vino underline">Volver al inicio</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
