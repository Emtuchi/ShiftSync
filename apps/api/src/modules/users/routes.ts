import { Router } from 'express';
import { userController } from './controller';

const router = Router();

// User CRUD
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

// Certification
router.post('/addcert', userController.addCertification);

// Availability endpoints
router.post('/:id/addAvailability', userController.addAvailability); // Add availability
router.get('/:id/availability', userController.getAvailability); // Get all availability for a staff
router.delete('/:id/availability/:availabilityId', userController.deleteAvailability); // Delete a specific availability

export default router;