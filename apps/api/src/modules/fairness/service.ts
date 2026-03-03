import { PrismaClient, AssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const fairnessService = {
  async getStaffHoursSummary(startDate: Date, endDate: Date) {
    const assignments = await prisma.shiftAssignment.findMany({
      where: {
        status: AssignmentStatus.CONFIRMED,
        shift: {
          startTime: { gte: startDate },
          endTime: { lte: endDate },
        },
      },
      include: { shift: true, staff: true },
    });

    const summary: Record<string, { name: string; hours: number }> = {};

    assignments.forEach(a => {
      const hours = (a.shift.endTime.getTime() - a.shift.startTime.getTime()) / (1000 * 60 * 60);
      if (!summary[a.staffId]) summary[a.staffId] = { name: a.staff.name || '', hours: 0 };
      summary[a.staffId].hours += hours;
    });

    return summary; // { staffId: { name, hours } }
  },

  async getPremiumShiftDistribution(startDate: Date, endDate: Date) {
    // Example: Friday/Saturday evening shifts are premium
    const premiumAssignments = await prisma.shiftAssignment.findMany({
      where: {
        status: AssignmentStatus.CONFIRMED,
        shift: {
          startTime: { gte: startDate },
          endTime: { lte: endDate },
        },
      },
      include: { shift: true, staff: true },
    });

    const premiumSummary: Record<string, number> = {};

    premiumAssignments.forEach(a => {
      const day = a.shift.startTime.getDay();
      const hour = a.shift.startTime.getHours();
      const isPremium = (day === 5 || day === 6) && hour >= 17; // Fri/Sat 5pm+
      if (isPremium) {
        if (!premiumSummary[a.staffId]) premiumSummary[a.staffId] = 0;
        premiumSummary[a.staffId] += 1;
      }
    });

    return premiumSummary; // { staffId: premiumShiftsCount }
  },
};