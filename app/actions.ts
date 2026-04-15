"use server";

import { DonationStatus, Priority, RequestStatus, Role, Urgency, ROLES } from "@/lib/domain";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sugerirPrioridad } from "@/lib/priority";
import { login, logout, requireRole, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Completa correo y contraseña." };
  }

  const user = await login(email, password);
  if (!user) return { error: "Credenciales inválidas." };

  redirect("/panel");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

export async function crearDonacionAction(formData: FormData) {
  const user = await requireRole([ROLES.DONANTE, ROLES.ADMIN]);
  const resourceType = String(formData.get("resourceType") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const notes = String(formData.get("notes") || "").trim();

  if (!resourceType || !description || quantity <= 0) {
    return;
  }

  const donation = await db.donation.create({
    data: { resourceType, description, quantity, notes, donorId: user.id }
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "DONACION_CREADA",
      detail: `Donación #${donation.id} creada (${resourceType}, ${quantity})`
    }
  });

  revalidatePath("/donaciones");
  revalidatePath("/panel");
  return;
}

export async function actualizarDonacionAction(formData: FormData) {
  const user = await requireRole([ROLES.DONANTE, ROLES.ADMIN]);
  const id = Number(formData.get("id"));
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const status = String(formData.get("status") || "DISPONIBLE") as DonationStatus;

  const donation = await db.donation.findUnique({ where: { id } });
  if (!donation) return;
  if (user.role !== ROLES.ADMIN && donation.donorId !== user.id) return;

  await db.donation.update({ where: { id }, data: { description, quantity, status } });
  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "DONACION_ACTUALIZADA",
      detail: `Donación #${id} actualizada a estado ${status}`
    }
  });

  revalidatePath("/donaciones");
  revalidatePath("/panel");
  return;
}

export async function crearSolicitudAction(formData: FormData) {
  const user = await requireRole([ROLES.ORGANIZACION, ROLES.ADMIN]);
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const urgency = String(formData.get("urgency") || "BAJA") as Urgency;
  const location = String(formData.get("location") || "").trim();
  const vulnerableGroup = String(formData.get("vulnerableGroup") || "") === "on";
  const unattendedHours = Number(formData.get("unattendedHours") || 0);
  const needType = String(formData.get("needType") || "GENERAL");

  if (!description || quantity <= 0 || !location) {
    return;
  }

  const sugerida = sugerirPrioridad({
    urgencia: urgency,
    cantidad: quantity,
    vulnerableGroup,
    unattendedHours,
    needType
  });
  const request = await db.request.create({
    data: {
      description,
      quantity,
      urgency,
      priority: sugerida.priority,
      suggestedPriority: sugerida.priority,
      suggestedReason: sugerida.reason,
      vulnerableGroup,
      unattendedHours,
      needType,
      location,
      organizationId: user.id
    }
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "SOLICITUD_CREADA",
      detail: `Solicitud #${request.id} creada en ${location}. Prioridad sugerida: ${sugerida.priority} (${sugerida.reason})`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/panel");
  return;
}

export async function actualizarSolicitudAction(formData: FormData) {
  const user = await requireRole([ROLES.ORGANIZACION, ROLES.ADMIN]);
  const id = Number(formData.get("id"));
  const description = String(formData.get("description") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const urgency = String(formData.get("urgency") || "BAJA") as Urgency;
  const status = String(formData.get("status") || "PENDIENTE") as RequestStatus;
  const vulnerableGroup = String(formData.get("vulnerableGroup") || "") === "on";
  const unattendedHours = Number(formData.get("unattendedHours") || 0);
  const needType = String(formData.get("needType") || "GENERAL");

  const request = await db.request.findUnique({ where: { id } });
  if (!request) return;
  if (user.role !== ROLES.ADMIN && request.organizationId !== user.id) return;

  const sugerida = sugerirPrioridad({
    urgencia: urgency,
    cantidad: quantity,
    vulnerableGroup,
    unattendedHours,
    needType
  });
  await db.request.update({
    where: { id },
    data: {
      description,
      quantity,
      urgency,
      status,
      vulnerableGroup,
      unattendedHours,
      needType,
      suggestedPriority: sugerida.priority,
      suggestedReason: sugerida.reason,
      priority: user.role === ROLES.ADMIN ? request.priority : sugerida.priority
    }
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "SOLICITUD_ACTUALIZADA",
      detail: `Solicitud #${id} actualizada. Sugerida: ${sugerida.priority} (${sugerida.reason}) · Estado: ${status}`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/panel");
  return;
}

export async function priorizarSolicitudAction(formData: FormData) {
  const user = await requireRole([ROLES.ADMIN]);
  const id = Number(formData.get("id"));
  const priority = String(formData.get("priority")) as Priority;

  const actual = await db.request.findUnique({ where: { id } });
  if (!actual) return;

  await db.request.update({
    where: { id },
    data: {
      priority,
      status: "PRIORIZADA"
    }
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "PRIORIDAD_CAMBIADA",
      detail: `Solicitud #${id}: sugerida ${actual.suggestedPriority}, confirmada/cambiada a ${priority}`
    }
  });

  revalidatePath("/solicitudes");
  revalidatePath("/panel");
}

export async function crearAsignacionAction(formData: FormData) {
  const user = await requireRole([ROLES.ADMIN]);
  const donationId = Number(formData.get("donationId"));
  const requestId = Number(formData.get("requestId"));
  const notes = String(formData.get("notes") || "");

  const donation = await db.donation.findUnique({ where: { id: donationId } });
  const request = await db.request.findUnique({ where: { id: requestId } });

  if (!donation || !request) return;
  if (donation.status !== "DISPONIBLE") return;

  // Al asignar, sincronizamos estados para mantener trazabilidad.
  await db.$transaction([
    db.assignment.create({ data: { donationId, requestId, assignedById: user.id, notes } }),
    db.donation.update({ where: { id: donationId }, data: { status: "ASIGNADA" } }),
    db.request.update({ where: { id: requestId }, data: { status: "ATENDIDA" } }),
    db.activityLog.create({
      data: {
        userId: user.id,
        action: "ASIGNACION_CREADA",
        detail: `Donación #${donationId} asignada a solicitud #${requestId}`
      }
    })
  ]);

  revalidatePath("/asignaciones");
  revalidatePath("/panel");
  revalidatePath("/donaciones");
  revalidatePath("/solicitudes");
  return;
}


export async function registrarEntregaAction(formData: FormData) {
  const user = await requireRole([ROLES.ADMIN]);
  const assignmentId = Number(formData.get("assignmentId"));
  const recipientName = String(formData.get("recipientName") || "").trim();
  const deliveryNotes = String(formData.get("deliveryNotes") || "").trim();
  const evidenceRef = String(formData.get("evidenceRef") || "").trim();
  const deliveredAtRaw = String(formData.get("deliveredAt") || "").trim();

  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment || !recipientName || !deliveredAtRaw) return;

  const deliveredAt = new Date(deliveredAtRaw);

  await db.$transaction([
    db.assignment.update({
      where: { id: assignmentId },
      data: {
        recipientName,
        deliveredAt,
        deliveryNotes,
        evidenceRef,
        deliveryConfirmed: true
      }
    }),
    db.donation.update({ where: { id: assignment.donationId }, data: { status: "ENTREGADA" } }),
    db.request.update({ where: { id: assignment.requestId }, data: { status: "CERRADA" } }),
    db.activityLog.create({
      data: {
        userId: user.id,
        action: "EVIDENCIA_ENTREGA_REGISTRADA",
        detail: `Asignación #${assignmentId} entregada a ${recipientName}. Evidencia: ${evidenceRef || "sin referencia"}`
      }
    })
  ]);

  revalidatePath("/asignaciones");
  revalidatePath("/panel");
  revalidatePath("/historial");
}

export async function actualizarPerfilAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim();

  if (name.length < 3) return;

  await db.user.update({ where: { id: user.id }, data: { name } });
  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "PERFIL_ACTUALIZADO",
      detail: "Actualizó su perfil"
    }
  });

  revalidatePath("/perfil");
  return;
}
