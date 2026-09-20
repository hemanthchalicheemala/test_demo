import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const unread = notifications.filter((n) => !n.read).length;
  res.json({ notifications, unread });
});

router.patch('/:id/read', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
  res.json({ notification: updated });
});

router.patch('/read-all', authenticate, async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.id, read: false }, data: { read: true } });
  res.json({ ok: true });
});

export default router;
