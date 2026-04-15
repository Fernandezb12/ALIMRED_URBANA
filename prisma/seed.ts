import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { calcularPrioridad } from "../lib/priority";

const prisma = new PrismaClient();

async function main() {
  // Seed de demo: reinicia datos operativos para una presentación consistente.
  await prisma.assignment.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.request.deleteMany();
  await prisma.organizationProfile.deleteMany();
  await prisma.user.deleteMany();

  const [adminPass, donantePass, orgPass] = await Promise.all([
    bcrypt.hash("Admin123*", 10),
    bcrypt.hash("Donante123*", 10),
    bcrypt.hash("Organizacion123*", 10)
  ]);

  const admin = await prisma.user.create({
    data: { name: "Admin AlimRed", email: "admin@alimred.local", role: Role.ADMIN, passwordHash: adminPass }
  });

  const donante = await prisma.user.create({
    data: { name: "Donante Demo", email: "donante@alimred.local", role: Role.DONANTE, passwordHash: donantePass }
  });

  const organizacion = await prisma.user.create({
    data: { name: "Comedor Esperanza", email: "organizacion@alimred.local", role: Role.ORGANIZACION, passwordHash: orgPass }
  });

  await prisma.organizationProfile.create({
    data: { userId: organizacion.id, district: "Centro Urbano", contactName: "Lucía Rojas", phone: "+51 999 333 222" }
  });

  const [d1, d2, d3] = await Promise.all([
    prisma.donation.create({ data: { resourceType: "Arroz", description: "Sacos de arroz de 50kg", quantity: 150, donorId: donante.id, status: "DISPONIBLE" } }),
    prisma.donation.create({ data: { resourceType: "Leche", description: "Cajas de leche evaporada", quantity: 80, donorId: donante.id, status: "DISPONIBLE" } }),
    prisma.donation.create({ data: { resourceType: "Conservas", description: "Latas variadas", quantity: 60, donorId: donante.id, status: "ENTREGADA" } })
  ]);

  const solicitudes = [
    { description: "Alimentos para 45 familias", quantity: 120, urgency: "ALTA" as const, location: "Barrio Santa Rosa", status: "PRIORIZADA" as const },
    { description: "Refuerzo para comedor infantil", quantity: 70, urgency: "MEDIA" as const, location: "Zona Industrial", status: "PENDIENTE" as const },
    { description: "Apoyo para adultos mayores", quantity: 40, urgency: "BAJA" as const, location: "Mercado Central", status: "ATENDIDA" as const }
  ];

  const creadas = [];
  for (const item of solicitudes) {
    creadas.push(
      await prisma.request.create({
        data: {
          ...item,
          priority: calcularPrioridad(item.urgency, item.quantity),
          organizationId: organizacion.id
        }
      })
    );
  }

  // Flujo demo preconfigurado: solicitud atendida mediante asignación registrada.
  const asignacion = await prisma.assignment.create({
    data: {
      donationId: d2.id,
      requestId: creadas[2].id,
      assignedById: admin.id,
      notes: "Entrega coordinada para jornada nocturna"
    }
  });

  await prisma.donation.update({ where: { id: d2.id }, data: { status: "ASIGNADA" } });

  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: "SISTEMA_INICIALIZADO", detail: "Base de datos sembrada para demo local." },
      { userId: donante.id, action: "DONACION_CREADA", detail: `Donación #${d1.id} lista para asignación.` },
      { userId: organizacion.id, action: "SOLICITUD_CREADA", detail: `Solicitud #${creadas[0].id} cargada con prioridad alta.` },
      { userId: admin.id, action: "PRIORIDAD_CAMBIADA", detail: `Solicitud #${creadas[0].id} confirmada como ALTA.` },
      { userId: admin.id, action: "ASIGNACION_CREADA", detail: `Asignación #${asignacion.id}: donación #${d2.id} → solicitud #${creadas[2].id}.` }
    ]
  });

  console.log("✅ Seed completado: cuentas demo y flujo principal listos para presentación.");
  console.log("   admin@alimred.local / Admin123*");
  console.log("   donante@alimred.local / Donante123*");
  console.log("   organizacion@alimred.local / Organizacion123*");
  console.log(`   Datos demo: ${d1.id}, ${d2.id}, ${d3.id} donaciones y ${creadas.length} solicitudes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
