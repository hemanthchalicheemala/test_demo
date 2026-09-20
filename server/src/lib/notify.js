import { prisma } from './prisma.js';

export async function notify({ userId, title, message, type = 'info', link = null }) {
  try {
    return await prisma.notification.create({
      data: { userId, title, message, type, link },
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
}
