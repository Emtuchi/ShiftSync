import { Router } from 'express';
import { locationController } from './controller.js';

const locationRoutes = Router();

locationRoutes.post('/', locationController.create);
locationRoutes.get('/', locationController.getAll);
locationRoutes.get('/:id', locationController.getById);
locationRoutes.put('/:id', locationController.update);
locationRoutes.delete('/:id', locationController.delete);

export default locationRoutes;