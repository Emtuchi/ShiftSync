import { prisma } from '../../config/database.js';

export const locationRepository = {
  create(data: { name: string; address: string }) {
    return prisma.location.create({ data });
  },

  findById(id: string) {
    return prisma.location.findUnique({ where: { id } });
  },

  findAll() {
    return prisma.location.findMany();
  },

  update(id: string, data: { name?: string; address?: string }) {
    return prisma.location.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.location.delete({ where: { id } });
  },
};