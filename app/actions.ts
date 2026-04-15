"use server";

import { DonationStatus, Priority, RequestStatus, Role, Urgency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calcularPrioridad } from "@/lib/priority";
import { login, logout, requireRole, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Completa correo y contraseña." };
  }

  const user = await login(email, password);
  if (!user) return { error: "Credenciales inválidas." };

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

export async function crearDonacionAction(formData: FormData) {
  const user = await requireRole([Role.DONANTE, Role.ADMIN]);
  const resourceType = String(formData.get("resourceType") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const notes = String(formData.get("notes") || "").trim();

  if (!resourceType || !description || quantity <= 0) {
    return { error: "Completa los campos obligatorios y usa cantidad válida." };
  }

  const donation = await prisma.donation.create({
    data: { resourceType, description, quantity, notes, donorId: user.id }
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "DONACION_CREADA",
      detail: `Donación #${donation.id} creada (${resourceType}, ${quantity})`
    }
  });

  revalidatePath("/donaciones");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function actualizarDonacionAction(formData: FormData) {
  const user = await requireRole([Role.DONANTE, Role.ADMIN]);
  const id = Number(formData.get("id"));
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const status = String(formData.get("status") || "DISPONIBLE") as DonationStatus;

  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation) return { error: "Donación no encontrada." };
  if (user.role !== Role.ADMIN && donation.donorId !== user.id) return { error: "Sin permisos." };

  await prisma.donation.update({ where: { id }, data: { description, quantity, status } });
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "DONACION_ACTUALIZADA",
      detail: `Donación #${id} actualizada a estado ${status}`
    }
  });

  revalidatePath("/donaciones");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function crearSolicitudAction(formData: FormData) {
  const user = await requireRole([Role.ORGANIZACION, Role.ADMIN]);
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const urgency = String(formData.get("urgency") || "BAJA") as Urgency;
  const location = String(formData.get("location") || "").trim();

  if (!description || quantity <= 0 || !location) {
    return { error: "Completa los campos obligatorios." };
  }

  const priority = calcularPrioridad(urgency, quantity);
  const request = await prisma.request.create({
    data: { description, quantity, urgency, priority, location, organizationId: user.id }
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "SOLICITUD_CREADA",
      detail: `Solicitud #${request.id} creada en ${location} con prioridad ${priority}`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function actualizarSolicitudAction(formData: FormData) {
  const user = await requireRole([Role.ORGANIZACION, Role.ADMIN]);
  const id = Number(formData.get("id"));
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const urgency = String(formData.get("urgency") || "BAJA") as Urgency;
  const status = String(formData.get("status") || "PENDIENTE") as RequestStatus;

  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) return { error: "Solicitud no encontrada." };
  if (user.role !== Role.ADMIN && request.organizationId !== user.id) return { error: "Sin permisos." };

  const priority = calcularPrioridad(urgency, quantity);
  await prisma.request.update({
    where: { id },
    data: { description, quantity, urgency, priority, status }
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "SOLICITUD_ACTUALIZADA",
      detail: `Solicitud #${id} actualizada (${priority}, ${status})`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function priorizarSolicitudAction(formData: FormData) {
  const user = await requireRole([Role.ADMIN]);
  const id = Number(formData.get("id"));
  const priority = String(formData.get("priority")) as Priority;

  await prisma.request.update({
    where: { id },
    data: {
      priority,
      status: "PRIORIZADA"
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "PRIORIDAD_CAMBIADA",
      detail: `Solicitud #${id} marcada como ${priority}`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/dashboard");
}

export async function crearAsignacionAction(formData: FormData) {
  const user = await requireRole([Role.ADMIN]);
  const donationId = Number(formData.get("donationId"));
  const requestId = Number(formData.get("requestId"));
  const notes = String(formData.get("notes") || "");

  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  const request = await prisma.request.findUnique({ where: { id: requestId } });

  if (!donation || !request) return { error: "Registros inválidos." };
  if (donation.status !== "DISPONIBLE") return { error: "La donación no está disponible." };

  // Al asignar, sincronizamos estados para mantener trazabilidad.
  await prisma.$transaction([
    prisma.assignment.create({ data: { donationId, requestId, assignedById: user.id, notes } }),
    prisma.donation.update({ where: { id: donationId }, data: { status: "ASIGNADA" } }),
    prisma.request.update({ where: { id: requestId }, data: { status: "ATENDIDA" } }),
    prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "ASIGNACION_CREADA",
        detail: `Donación #${donationId} asignada a solicitud #${requestId}`
      }
    })
  ]);

  revalidatePath("/asignaciones");
  revalidatePath("/dashboard");
  revalidatePath("/donaciones");
  revalidatePath("/solicitudes");
  return { ok: true };
}

export async function actualizarPerfilAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim();

  if (name.length < 3) return { error: "El nombre debe tener al menos 3 caracteres." };

  await prisma.user.update({ where: { id: user.id }, data: { name } });
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "PERFIL_ACTUALIZADO",
      detail: "Actualizó su perfil"
    }
  });

  revalidatePath("/perfil");
  return { ok: true };
}
