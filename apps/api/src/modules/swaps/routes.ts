import { Router } from 'express';
import { swapController } from './controller';

const router = Router();

router.post('/request', swapController.requestSwap);
router.post('/:id/accept', swapController.acceptSwap);
router.post('/:id/approve', swapController.approveSwap);

export default router;