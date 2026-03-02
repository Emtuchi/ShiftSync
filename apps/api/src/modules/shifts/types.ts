// DTOs and enums for Shift module

export type ShiftResponseDTO = {
  id: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  requiredSkill: string;
  headcount: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export enum AssignmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export type ShiftAssignmentDTO = {
  id: string;
  shiftId: string;
  staffId: string;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
};