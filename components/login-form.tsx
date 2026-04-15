"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(async (_: { error: string }, formData: FormData) => {
    const result = await loginAction(formData);
    return { error: result?.error ?? "" };
  }, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Correo</label>
        <Input type="email" name="email" placeholder="tu-correo@alimred.local" required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Contraseña</label>
        <Input type="password" name="password" required />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Validando..." : "Entrar"}</Button>
    </form>
  );
}
