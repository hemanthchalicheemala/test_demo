import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { notify } from '../lib/notify.js';

const router = Router();

const include = {
  owner: { select: { id: true, name: true } },
  property: { select: { id: true, title: true } },
};

// Owner: list own announcements
router.get('/mine', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    where: { ownerId: req.user.id },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ announcements });
});

// Tenant: announcements relevant to me (from owners of my active leases)
router.get('/feed', authenticate, async (req, res) => {
  const leases = await prisma.lease.findMany({
    where: { tenantId: req.user.id, active: true },
    select: { ownerId: true, propertyId: true },
  });
  const ownerIds = [...new Set(leases.map((l) => l.ownerId))];
  const announcements = await prisma.announcement.findMany({
    where: { ownerId: { in: ownerIds.length ? ownerIds : [-1] } },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ announcements });
});

// Owner: create announcement (notifies current tenants)
router.post('/', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const { title, body, propertyId } = req.body;
  const announcement = await prisma.announcement.create({
    data: {
      ownerId: req.user.id,
      title,
      body,
      propertyId: propertyId ? Number(propertyId) : null,
    },
    include,
  });

  // Notify current tenants of this owner (optionally scoped to a property)
  const leaseWhere = { ownerId: req.user.id, active: true };
  if (propertyId) leaseWhere.propertyId = Number(propertyId);
  const leases = await prisma.lease.findMany({ where: leaseWhere, select: { tenantId: true } });
  const tenantIds = [...new Set(leases.map((l) => l.tenantId))];
  await Promise.all(
    tenantIds.map((tenantId) =>
      notify({
        userId: tenantId,
        title: `Notice: ${title}`,
        message: body,
        type: 'info',
        link: '/tenant/notifications',
      })
    )
  );

  res.status(201).json({ announcement });
});

router.delete('/:id', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const a = await prisma.announcement.findUnique({ where: { id } });
  if (!a) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'ADMIN' && a.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  await prisma.announcement.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
