import { shiftRepository } from './repository.js';
import { ShiftResponseDTO } from './types.js';
import { AppError } from '../../shared/errors/App.error.js';
import { PrismaClient, AssignmentStatus, ShiftStatus, UserRole } from '@prisma/client';
import { validateAssignmentRules } from './shiftvalidator.js';
import { overtimeService } from '../overtime/service.js';

const prisma = new PrismaClient();


export const shiftService = {
  async createShift(data: any): Promise<ShiftResponseDTO> {
    const shift = await shiftRepository.create(data);
    return this.toDTO(shift);
  },

  async getShiftById(id: string): Promise<ShiftResponseDTO> {
    const shift = await shiftRepository.findById(id);
    if (!shift) throw new AppError('Shift not found', 404);
    return this.toDTO(shift);
  },

  async getShifts(): Promise<ShiftResponseDTO[]> {
    const shifts = await shiftRepository.findAll();
    return shifts.map(this.toDTO);
  },

  async updateShift(id: string, data: any): Promise<ShiftResponseDTO> {
    const existing = await shiftRepository.findById(id);
    if (!existing) throw new AppError('Shift not found', 404);
    const updated = await shiftRepository.update(id, data);
    return this.toDTO(updated);
  },

  async deleteShift(id: string) {
    const existing = await shiftRepository.findById(id);
    if (!existing) throw new AppError('Shift not found', 404);
    await shiftRepository.delete(id);
  },
  
  async assignStaff(shiftId: string, staffId: string) {
    return prisma.$transaction(async (tx) => {
      const shift = await tx.shift.findUnique({ where: { id: shiftId }, include: { assignments: true } });
      if (!shift) throw new AppError('Shift not found', 404);
      
      const staff = await tx.user.findUnique({ where: { id: staffId } });
      if (!staff) throw new AppError('Staff not found', 404);
      
      await validateAssignmentRules(prisma, shift, staff);
      await overtimeService.checkDailyHours(staffId, shift);
      await overtimeService.checkWeeklyHours(staffId, shift);
      await overtimeService.checkConsecutiveDays(staffId, shift);
      return tx.shiftAssignment.create({
        data: { shiftId, staffId, status: AssignmentStatus.CONFIRMED },
      });
    });
  },

  async unassignStaff(shiftId: string, staffId: string) {
    return shiftRepository.unassignStaff(shiftId, staffId);
  },

  async publishShift(id: string) {
    return shiftRepository.publishShift(id);
  },

  async unpublishShift(id: string) {
    return shiftRepository.unpublishShift(id);
  },

  toDTO(shift: any): ShiftResponseDTO {
    return {
      id: shift.id,
      locationId: shift.locationId,
      startTime: shift.startTime,
      endTime: shift.endTime,
      requiredSkillId: shift.requiredSkillId,
      headcount: shift.headcount,
      published: shift.published,
      createdAt: shift.createdAt,
      updatedAt: shift.updatedAt,
    };
  },
};
