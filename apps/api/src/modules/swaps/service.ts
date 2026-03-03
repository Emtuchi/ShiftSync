import { PrismaClient, SwapStatus, AssignmentStatus } from '@prisma/client';
import { AppError } from '../../shared/errors/App.error.js';

const prisma = new PrismaClient();

const MAX_PENDING = 3;

export const swapService = {
  async requestSwap(originalAssignmentId: string, targetStaffId?: string) {
    return prisma.$transaction(async (tx) => {

      const assignment = await tx.shiftAssignment.findUnique({
        where: { id: originalAssignmentId },
        include: { shift: true }
      });

      if (!assignment)
        throw new AppError('Assignment not found', 404);

      if (assignment.status !== AssignmentStatus.CONFIRMED)
        throw new AppError('Only confirmed assignments can be swapped', 400);

      // 24h expiry rule
      const now = new Date();
      const diffHours =
        (assignment.shift.startTime.getTime() - now.getTime()) /
        (1000 * 60 * 60);

      if (diffHours <= 24)
        throw new AppError('Cannot request swap within 24h of shift start', 400);

      // Max 3 pending rule
      const pendingCount = await tx.swapRequest.count({
        where: {
          originalAssignment: { staffId: assignment.staffId },
          status: SwapStatus.PENDING
        }
      });

      if (pendingCount >= MAX_PENDING)
        throw new AppError('Max 3 pending swap requests allowed', 400);

      const swap = await tx.swapRequest.create({
        data: {
          type: targetStaffId ? 'FULL' : 'FULL',
          originalAssignmentId,
          targetStaffId
        }
      });

      // Notification
      if (targetStaffId) {
        await tx.notification.create({
          data: {
            userId: targetStaffId,
            message: 'You have a swap request pending.'
          }
        });
      }

      return swap;
    });
  },

  async acceptSwap(swapId: string, staffId: string) {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
      include: { originalAssignment: true }
    });

    if (!swap) throw new AppError('Swap not found', 404);

    if (swap.targetStaffId !== staffId)
      throw new AppError('Not authorized to accept this swap', 403);

    return prisma.swapRequest.update({
      where: { id: swapId },
      data: { status: SwapStatus.PENDING } // still pending until manager approves
    });
  },

  async approveSwap(swapId: string) {
    return prisma.$transaction(async (tx) => {
      const swap = await tx.swapRequest.findUnique({
        where: { id: swapId },
        include: {
          originalAssignment: true
        }
      });

      if (!swap)
        throw new AppError('Swap not found', 404);

      if (!swap.targetStaffId)
        throw new AppError('Drop requests not implemented yet', 400);

      // Perform swap
      await tx.shiftAssignment.update({
        where: { id: swap.originalAssignmentId },
        data: { staffId: swap.targetStaffId }
      });

      await tx.swapRequest.update({
        where: { id: swapId },
        data: { status: SwapStatus.APPROVED }
      });

      // Notify both
      await tx.notification.createMany({
        data: [
          {
            userId: swap.originalAssignment.staffId,
            message: 'Your swap was approved.'
          },
          {
            userId: swap.targetStaffId,
            message: 'Swap approved. You are now assigned.'
          }
        ]
      });

      return { message: 'Swap completed' };
    });
  }
};