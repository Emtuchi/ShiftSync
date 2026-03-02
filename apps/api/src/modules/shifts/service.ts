import { shiftRepository } from './repository';
import { ShiftResponseDTO } from './types';
import { AppError } from '../../shared/errors/App.error';

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
    // TODO: Check skills, availability, overtime rules here
    return shiftRepository.assignStaff(shiftId, staffId);
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
      requiredSkill: shift.requiredSkill,
      headcount: shift.headcount,
      published: shift.published,
      createdAt: shift.createdAt,
      updatedAt: shift.updatedAt,
    };
  },
};