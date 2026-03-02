import { Router } from 'express';
import { userController } from './controller';

const router = Router();

router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.post('/addcert', userController.addCertification);

export default router;