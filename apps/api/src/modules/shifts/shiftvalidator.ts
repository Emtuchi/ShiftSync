// modules/shifts/validators.ts
import { PrismaClient, Shift, User, AssignmentStatus } from '@prisma/client';
import { AppError } from '../../shared/errors/App.error.js';

export async function validateAssignmentRules(
  tx: PrismaClient,
  shift: Shift & { assignments: any[] },
  staff: User
) {
  // Skill Check
  const skillMatch = await tx.staffSkill.findFirst({
    where: { staffId: staff.id, skillId: shift.requiredSkillId },
  });
  if (!skillMatch) throw new AppError('Staff lacks required skill', 400);

  // Certification Check
  const cert = await tx.staffCertification.findFirst({
    where: { staffId: staff.id, locationId: shift.locationId },
  });
  if (!cert) throw new AppError('Staff not certified for this location', 400);

  // Headcount Check
  const confirmedCount = await tx.shiftAssignment.count({
    where: { shiftId: shift.id, status: AssignmentStatus.CONFIRMED },
  });
  if (confirmedCount >= shift.headcount)
    throw new AppError('Shift headcount full', 400);

  // Overlap Check
  const overlapping = await tx.shiftAssignment.findFirst({
    where: {
      staffId: staff.id,
      status: AssignmentStatus.CONFIRMED,
      shift: { startTime: { lt: shift.endTime }, endTime: { gt: shift.startTime } },
    },
    include: { shift: true },
  });
  if (overlapping) throw new AppError('Staff already assigned to overlapping shift', 400);

  // Availability Check
  const available = await tx.availabilityWindow.findFirst({
    where: {
      staffId: staff.id,
      startTime: { lte: shift.startTime },
      endTime: { gte: shift.endTime },
    },
  });
  if (!available) throw new AppError('Staff not available during shift hours', 400);

  // Minimum 10 hours rest
  const lastShift = await tx.shiftAssignment.findFirst({
    where: {
      staffId: staff.id,
      status: AssignmentStatus.CONFIRMED,
      shift: { endTime: { lte: shift.startTime } },
    },
    orderBy: { shift: { endTime: 'desc' } },
    include: { shift: true },
  });
  if (lastShift) {
    const hoursDiff = (shift.startTime.getTime() - lastShift.shift.endTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 10)
      throw new AppError(`Minimum 10 hours rest required. Only ${hoursDiff.toFixed(1)} hours gap.`, 400);
  }
}