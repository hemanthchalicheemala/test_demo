import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

function publicUser(u) {
  if (!u) return u;
  const { password, ...rest } = u;
  return rest;
}

// Update own profile
router.put('/me', authenticate, async (req, res) => {
  const { name, phone, city, bio, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone, city, bio, avatar },
  });
  res.json({ user: publicUser(user) });
});

// Get a single user's public profile
router.get('/:id', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

// Admin: list all users
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { properties: true, requests: true, complaints: true } },
    },
  });
  res.json({ users: users.map(publicUser) });
});

// Admin: delete a user
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
