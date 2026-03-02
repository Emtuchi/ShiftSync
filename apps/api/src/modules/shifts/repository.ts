import { prisma } from '../../config/database';
import { Prisma, ShiftStatus, AssignmentStatus } from '@prisma/client';

export const shiftRepository = {
  async create(data: Prisma.ShiftCreateInput) {
    return prisma.shift.create({ data });
  },

  async findById(id: string) {
    return prisma.shift.findUnique({
      where: { id },
      include: { assignments: true },
    });
  },

  async findAll() {
    return prisma.shift.findMany({
      include: { assignments: true },
    });
  },

  async update(id: string, data: Prisma.ShiftUpdateInput) {
    return prisma.shift.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.shift.delete({ where: { id } });
  },

  async assignStaff(shiftId: string, staffId: string) {
    return prisma.shiftAssignment.create({
      data: {
        shiftId,
        staffId,
        status: AssignmentStatus.PENDING,
      },
    });
  },

  async unassignStaff(shiftId: string, staffId: string): Promise<void> {
    await prisma.shiftAssignment.deleteMany({
      where: { shiftId, staffId },
    });
  },

  async publishShift(id: string) {
    return prisma.shift.update({
      where: { id },
      data: { status: ShiftStatus.PUBLISHED,
              published: true 
        },
    });
  },

  async unpublishShift(id: string) {
    return prisma.shift.update({
      where: { id },
      data: { status: ShiftStatus.DRAFT, 
              published: false,
       },
    });
  },
};