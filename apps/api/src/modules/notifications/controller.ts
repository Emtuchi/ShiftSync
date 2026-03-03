import { Request, Response } from 'express';
import { notificationService } from './service';

export const notificationController = {
  async create(req: Request, res: Response) {
    const { userId, message } = req.body;
    const notification = await notificationService.createNotification(userId, message);
    res.status(201).json(notification);
  },

  async getAll(req: Request, res: Response) {
    const userId = req.params.userId;
    const notifications = await notificationService.getNotifications(userId as string);
    res.json(notifications);
  },

  async markRead(req: Request, res: Response) {
    const notificationId = req.params.id;
    const updated = await notificationService.markAsRead(notificationId as string);
    res.json(updated);
  },
};