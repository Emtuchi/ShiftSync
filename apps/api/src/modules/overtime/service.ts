// modules/overtime/service.ts
import { PrismaClient, ShiftAssignment, AssignmentStatus } from '@prisma/client';
import { AppError } from '../../shared/errors/App.error.js';

const prisma = new PrismaClient();

const DAILY_WARNING_HOURS = 8;
const DAILY_HARD_LIMIT = 12;
const WEEKLY_WARNING_HOURS = 35;
const WEEKLY_LIMIT = 40;

export const overtimeService = {
  async checkDailyHours(staffId: string, newShift: { startTime: Date; endTime: Date }) {
    const startOfDay = new Date(newShift.startTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const sameDayAssignments = await prisma.shiftAssignment.findMany({
      where: {
        staffId,
        status: AssignmentStatus.CONFIRMED,
        shift: { startTime: { gte: startOfDay, lte: endOfDay } },
      },
      include: { shift: true },
    });

    let dailyHours = sameDayAssignments.reduce((acc, a) => {
      return acc + (a.shift.endTime.getTime() - a.shift.startTime.getTime()) / (1000 * 60 * 60);
    }, 0);

    const newShiftHours = (newShift.endTime.getTime() - newShift.startTime.getTime()) / (1000 * 60 * 60);
    dailyHours += newShiftHours;

    if (dailyHours > DAILY_HARD_LIMIT) {
      throw new AppError(`RULE_VIOLATION: Daily hours exceed ${DAILY_HARD_LIMIT}`, 400);
    }

    if (dailyHours > DAILY_WARNING_HOURS) {
      console.warn(`WARNING: Daily hours exceed recommended limit (${DAILY_WARNING_HOURS})`);
    }
  },

  async checkWeeklyHours(staffId: string, newShift: { startTime: Date; endTime: Date }) {
    const startOfWeek = new Date(newShift.startTime);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const weekAssignments = await prisma.shiftAssignment.findMany({
      where: {
        staffId,
        status: AssignmentStatus.CONFIRMED,
        shift: { startTime: { gte: startOfWeek, lt: endOfWeek } },
      },
      include: { shift: true },
    });

    let weeklyHours = weekAssignments.reduce((acc, a) => {
      return acc + (a.shift.endTime.getTime() - a.shift.startTime.getTime()) / (1000 * 60 * 60);
    }, 0);

    const newShiftHours = (newShift.endTime.getTime() - newShift.startTime.getTime()) / (1000 * 60 * 60);
    weeklyHours += newShiftHours;

    if (weeklyHours > WEEKLY_LIMIT) {
      console.warn(`WARNING: Staff exceeding ${WEEKLY_LIMIT} weekly hours`);
    }

    if (weeklyHours > WEEKLY_WARNING_HOURS) {
      console.warn(`WARNING: Staff approaching overtime (${WEEKLY_WARNING_HOURS})`);
    }
  },

  async checkConsecutiveDays(staffId: string, newShift: { startTime: Date }) {
    const pastAssignments = await prisma.shiftAssignment.findMany({
      where: { staffId, status: AssignmentStatus.CONFIRMED },
      include: { shift: true },
    });

    const workedDates = new Set(pastAssignments.map(a => a.shift.startTime.toDateString()));
    workedDates.add(newShift.startTime.toDateString());

    if (workedDates.size >= 7) {
      throw new AppError('RULE_VIOLATION: 7 consecutive days requires manager override', 400);
    }

    if (workedDates.size === 6) {
      console.warn('WARNING: 6th consecutive working day');
    }
  },
};