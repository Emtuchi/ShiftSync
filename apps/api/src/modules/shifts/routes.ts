import { Router } from 'express';
import { shiftController } from './controller';

const router = Router();

// SHIFT CRUD
router.post('/', shiftController.createShift);       // Create a new shift
router.get('/', shiftController.getShifts);         // List all shifts
router.get('/:id', shiftController.getShiftById);   // Get single shift by ID
router.put('/:id', shiftController.updateShift);    // Update shift
router.delete('/:id', shiftController.deleteShift); // Delete shift

// SHIFT ASSIGNMENTS
router.post('/:id/assign', shiftController.assignStaff);      // Assign staff (body: { staffId })
router.delete('/:id/assign', shiftController.unassignStaff); // Unassign staff (body: { staffId })

// SHIFT PUBLISHING
router.put('/:id/publish', shiftController.publishShift);     // Publish shift
router.put('/:id/unpublish', shiftController.unpublishShift); // Unpublish shift

export default router;