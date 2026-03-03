import { prisma } from '../../config/database.js';

export const skillRepository = {
  async create(data: { name: string; description?: string }) {
    return prisma.skill.create({ data });
  },

  async findAll() {
    return prisma.skill.findMany();
  },

  async findById(id: string) {
    return prisma.skill.findUnique({ where: { id } });
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return prisma.skill.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  },
};