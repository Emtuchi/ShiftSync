import { skillRepository } from './repository';
import { prisma } from '../../config/database';

export const skillService = {
  createSkill(data: { name: string; description?: string }) {
    return skillRepository.create(data);
  },

  getAllSkills() {
    return skillRepository.findAll();
  },

  getSkillById(id: string) {
    return skillRepository.findById(id);
  },

  updateSkill(id: string, data: { name?: string; description?: string }) {
    return skillRepository.update(id, data);
  },

  deleteSkill(id: string) {
    return skillRepository.delete(id);
  },

  async assignSkillToStaff(staffId: string, skillId: string) {
    return prisma.staffSkill.create({
      data: { staffId, skillId },
    });
  }
};