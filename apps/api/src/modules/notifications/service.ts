import { PrismaClient, Notification } from '@prisma/client';

const prisma = new PrismaClient();

export const notificationService = {
  async createNotification(userId: string, message: string): Promise<Notification> {
    return prisma.notification.create({ data: { userId, message } });
  },

  async getNotifications(userId: string) {
    return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  },

  async markAsRead(notificationId: string) {
    return prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
  },
};