import { Router } from 'express';
import { skillController } from './controller.js';

const router = Router();

router.post('/', skillController.createSkill);
router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkillById);
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);
router.post('/assign', skillController.assignSkill);

export default router;