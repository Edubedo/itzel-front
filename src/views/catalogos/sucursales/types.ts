// DENTRO DE TU NUEVO ARCHIVO: types.ts

export enum BranchStatus {
  Open = 'Abierto',
  Closed = 'Cerrado',
  Maintenance = 'En Mantenimiento',
}

export interface Branch {
  id: string;
  address: string;
  municipality: string;
  status: BranchStatus;
}