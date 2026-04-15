export const ROLES = {
  ADMIN: "ADMIN",
  DONANTE: "DONANTE",
  ORGANIZACION: "ORGANIZACION"
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const DONATION_STATUS = {
  DISPONIBLE: "DISPONIBLE",
  ASIGNADA: "ASIGNADA",
  ENTREGADA: "ENTREGADA"
} as const;
export type DonationStatus = (typeof DONATION_STATUS)[keyof typeof DONATION_STATUS];

export const REQUEST_STATUS = {
  PENDIENTE: "PENDIENTE",
  PRIORIZADA: "PRIORIZADA",
  ATENDIDA: "ATENDIDA",
  CERRADA: "CERRADA"
} as const;
export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const PRIORITY = {
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAJA: "BAJA"
} as const;
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const URGENCY = {
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAJA: "BAJA"
} as const;
export type Urgency = (typeof URGENCY)[keyof typeof URGENCY];

export const MAP_POINT_TYPE = {
  DONACION: "DONACION",
  SOLICITUD: "SOLICITUD",
  ENTREGA: "ENTREGA",
  ORGANIZACION: "ORGANIZACION"
} as const;
export type MapPointType = (typeof MAP_POINT_TYPE)[keyof typeof MAP_POINT_TYPE];
