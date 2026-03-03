import { prisma } from '../../config/database.js';
import { Prisma, ShiftStatus } from '@prisma/client';

export const shiftRepository = {
  // CREATE SHIFT
  async create(data: Prisma.ShiftCreateInput) {
    return prisma.shift.create({ data });
  },

  // FIND SHIFT BY ID
  async findById(id: string) {
    return prisma.shift.findUnique({
      where: { id },
      include: { assignments: true }, // include assignments for headcount / overlap checks
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
    return prisma.shift.delete({
      where: { id },
    });
  },

  async unassignStaff(shiftId: string, staffId: string) {
    return prisma.shiftAssignment.deleteMany({
      where: { shiftId, staffId },
    });
  },

  async publishShift(id: string) {
    return prisma.shift.update({
      where: { id },
      data: { status: ShiftStatus.PUBLISHED, published: true },
    });
  },

  async unpublishShift(id: string) {
    return prisma.shift.update({
      where: { id },
      data: { status: ShiftStatus.DRAFT, published: false },
    });
  },
};