import { prisma } from '../../config/database.js';
import { Prisma } from '@prisma/client';

export const userRepository = {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findAll() {
    return prisma.user.findMany();
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async addCertification(staffId: string, locationId: string) {
    return prisma.staffCertification.create({
      data: {
        staffId,
        locationId,
      },
    });
  },

  async addAvailability(
    staffId: string,
    startTime: Date,
    endTime: Date
  ) {
    return prisma.availabilityWindow.create({
      data: {
        staffId,
        startTime,
        endTime,
      },
    });
  },

  async getAvailabilityByStaff(staffId: string) {
    return prisma.availabilityWindow.findMany({
      where: { staffId },
      orderBy: { startTime: 'asc' },
    });
  },

  async deleteAvailability(id: string) {
    return prisma.availabilityWindow.delete({
      where: { id },
    });
  },
};