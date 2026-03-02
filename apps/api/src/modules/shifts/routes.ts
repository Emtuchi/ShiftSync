import { Router } from 'express';
import { shiftController } from './controller';

const router = Router();

router.post('/', shiftController.createShift);
router.get('/', shiftController.getShifts);
router.get('/:id', shiftController.getShiftById);
router.put('/:id', shiftController.updateShift);
router.delete('/:id', shiftController.deleteShift);

router.post('/:id/assign', shiftController.assignStaff);
router.post('/:id/unassign', shiftController.unassignStaff);
router.post('/:id/publish', shiftController.publishShift);
router.post('/:id/unpublish', shiftController.unpublishShift);

export default router;