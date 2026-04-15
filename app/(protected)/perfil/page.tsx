import { actualizarPerfilAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireUser, roleLabel } from "@/lib/auth";

export default async function PerfilPage() {
  const user = await requireUser();

  return (
    <Card>
      <CardHeader><CardTitle>Perfil básico</CardTitle></CardHeader>
      <CardContent>
        <form action={actualizarPerfilAction} className="space-y-4 max-w-lg">
          <div>
            <label className="mb-1 block text-sm">Nombre</label>
            <Input name="name" defaultValue={user.name} required minLength={3} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Correo</label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <label className="mb-1 block text-sm">Rol</label>
            <Input value={roleLabel(user.role)} disabled />
          </div>
          <Button type="submit">Guardar cambios</Button>
        </form>
      </CardContent>
    </Card>
  );
}
