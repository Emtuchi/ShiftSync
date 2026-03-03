import { Router } from 'express';
import { notificationController } from './controller';

const notificationRouter = Router();

notificationRouter.post('/', notificationController.create);
notificationRouter.get('/:userId', notificationController.getAll);
notificationRouter.patch('/:id/read', notificationController.markRead);

export default notificationRouter;