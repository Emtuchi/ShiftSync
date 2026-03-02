import { shiftRepository } from './repository';
import { ShiftResponseDTO } from './types';
import { AppError } from '../../shared/errors/App.error';
import { PrismaClient, AssignmentStatus, ShiftStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const MIN_REST_HOURS = 10;
const DAILY_WARNING_HOURS = 8;
const DAILY_HARD_LIMIT = 12;
const WEEKLY_WARNING_HOURS = 35;
const WEEKLY_LIMIT = 40;

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
      const shift = await tx.shift.findUnique({
        where: { id: shiftId },
        include: { assignments: true },
      });

      if (!shift) throw new AppError('Shift not found', 404);
      if (shift.status !== ShiftStatus.PUBLISHED)
        throw new AppError('Shift must be published before assignment', 400);

      const staff = await tx.user.findUnique({
        where: { id: staffId },
      });

      if (!staff) throw new AppError('Staff not found', 404);
      if (staff.role !== UserRole.STAFF)
        throw new AppError('Only staff can be assigned to shifts', 400);

      // Skill Check
      const skillMatch = await tx.staffSkill.findFirst({
        where: {
          staffId,
          skillId: shift.requiredSkillId,
        },
      });

      if (!skillMatch)
        throw new AppError('RULE_VIOLATION: Staff lacks required skill', 400);

      // Certification Check
      const certification = await tx.staffCertification.findFirst({
        where: {
          staffId,
          locationId: shift.locationId,
        },
      });

      if (!certification)
        throw new AppError(
          'RULE_VIOLATION: Staff not certified for this location',
          400
        );

      // Headcount Check
      const confirmedCount = await tx.shiftAssignment.count({
        where: {
          shiftId,
          status: AssignmentStatus.CONFIRMED,
        },
      });

      if (confirmedCount >= shift.headcount)
        throw new AppError('RULE_VIOLATION: Shift headcount full', 400);

      // Duplicate Check
      const existingAssignment = await tx.shiftAssignment.findFirst({
        where: { shiftId, staffId },
      });

      if (existingAssignment)
        throw new AppError('Staff already assigned to this shift', 400);

      // Overlap Check
      const overlapping = await tx.shiftAssignment.findFirst({
        where: {
          staffId,
          status: AssignmentStatus.CONFIRMED,
          shift: {
            startTime: { lt: shift.endTime },
            endTime: { gt: shift.startTime },
          },
        },
        include: { shift: true },
      });

      if (overlapping)
        throw new AppError(
          'RULE_VIOLATION: Staff already assigned to overlapping shift',
          400
        );

      // 10 Hour Rest Rule
      const lastShift = await tx.shiftAssignment.findFirst({
        where: {
          staffId,
          status: AssignmentStatus.CONFIRMED,
          shift: {
            endTime: { lte: shift.startTime },
          },
        },
        orderBy: {
          shift: { endTime: 'desc' },
        },
        include: { shift: true },
      });

      if (lastShift) {
        const hoursDiff =
          (shift.startTime.getTime() -
            lastShift.shift.endTime.getTime()) /
          (1000 * 60 * 60);

        if (hoursDiff < MIN_REST_HOURS)
          throw new AppError(
            `RULE_VIOLATION: Minimum ${MIN_REST_HOURS} hour rest required. Only ${hoursDiff.toFixed(
              1
            )} hours gap.`,
            400
          );
      }

      // Availability Check
      const available = await tx.availabilityWindow.findFirst({
        where: {
          staffId,
          startTime: { lte: shift.startTime },
          endTime: { gte: shift.endTime },
        },
      });

      if (!available)
        throw new AppError(
          'RULE_VIOLATION: Staff not available during shift hours',
          400
        );

      // Daily Hours Check
      const startOfDay = new Date(shift.startTime);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const sameDayAssignments = await tx.shiftAssignment.findMany({
        where: {
          staffId,
          status: AssignmentStatus.CONFIRMED,
          shift: {
            startTime: { gte: startOfDay, lte: endOfDay },
          },
        },
        include: { shift: true },
      });

      let dailyHours = sameDayAssignments.reduce((acc, a) => {
        return (
          acc +
          (a.shift.endTime.getTime() -
            a.shift.startTime.getTime()) /
            (1000 * 60 * 60)
        );
      }, 0);

      const newShiftHours =
        (shift.endTime.getTime() - shift.startTime.getTime()) /
        (1000 * 60 * 60);

      dailyHours += newShiftHours;

      if (dailyHours > DAILY_HARD_LIMIT)
        throw new AppError(
          `RULE_VIOLATION: Daily hours exceed ${DAILY_HARD_LIMIT}`,
          400
        );

      if (dailyHours > DAILY_WARNING_HOURS)
        console.warn('WARNING: Daily hours exceed recommended limit');

      // Weekly Hours Check
      const startOfWeek = new Date(shift.startTime);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const weekAssignments = await tx.shiftAssignment.findMany({
        where: {
          staffId,
          status: AssignmentStatus.CONFIRMED,
          shift: {
            startTime: { gte: startOfWeek, lt: endOfWeek },
          },
        },
        include: { shift: true },
      });

      let weeklyHours = weekAssignments.reduce((acc, a) => {
        return (
          acc +
          (a.shift.endTime.getTime() -
            a.shift.startTime.getTime()) /
            (1000 * 60 * 60)
        );
      }, 0);

      weeklyHours += newShiftHours;

      if (weeklyHours > WEEKLY_LIMIT)
        console.warn('WARNING: Staff exceeding 40 weekly hours');

      if (weeklyHours > WEEKLY_WARNING_HOURS)
        console.warn('WARNING: Staff approaching overtime');

      // Consecutive Days Check
      const pastWeekAssignments = await tx.shiftAssignment.findMany({
        where: {
          staffId,
          status: AssignmentStatus.CONFIRMED,
        },
        include: { shift: true },
      });

      const workedDates = new Set(
        pastWeekAssignments.map((a) =>
          a.shift.startTime.toDateString()
        )
      );

      workedDates.add(shift.startTime.toDateString());

      if (workedDates.size >= 7)
        throw new AppError(
          'RULE_VIOLATION: 7 consecutive days requires manager override',
          400
        );

      if (workedDates.size === 6)
        console.warn('WARNING: 6th consecutive working day');

      // Create Assignment
      return tx.shiftAssignment.create({
        data: {
          shiftId,
          staffId,
          status: AssignmentStatus.CONFIRMED,
        },
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
