import { Request, Response } from 'express';
import { skillService } from './service.js';

interface SkillParams {
  id: string;
}

export const skillController = {
  async createSkill(req: Request, res: Response) {
    const skill = await skillService.createSkill(req.body);
    res.status(201).json(skill);
  },

  async getSkills(req: Request, res: Response) {
    const skills = await skillService.getAllSkills();
    res.json(skills);
  },

  async getSkillById(req: Request<SkillParams>, res: Response) {
    const skill = await skillService.getSkillById(req.params.id);
    res.json(skill);
  },

  async updateSkill(req: Request<SkillParams>, res: Response) {
    const skill = await skillService.updateSkill(req.params.id, req.body);
    res.json(skill);
  },

  async deleteSkill(req: Request<SkillParams>, res: Response) {
    await skillService.deleteSkill(req.params.id);
    res.status(204).send();
  },

  async assignSkill(req: Request, res: Response) {
    const { staffId, skillId } = req.body;
    const record = await skillService.assignSkillToStaff(staffId, skillId);
    res.status(201).json(record);
  },
};