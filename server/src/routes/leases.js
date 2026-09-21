import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const include = {
  property: { include: { images: true } },
  tenant: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
  owner: { select: { id: true, name: true, email: true, phone: true } },
};

// Tenant: my active/past leases (rental agreements)
router.get('/mine', authenticate, async (req, res) => {
  const leases = await prisma.lease.findMany({
    where: { tenantId: req.user.id },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ leases });
});

// Owner: current tenants (active leases on my properties)
router.get('/tenants', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const leases = await prisma.lease.findMany({
    where: { ownerId: req.user.id, active: true },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ leases });
});

// End a lease (owner/admin) -> frees the property
router.patch('/:id/end', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const lease = await prisma.lease.findUnique({ where: { id } });
  if (!lease) return res.status(404).json({ error: 'Lease not found' });
  if (req.user.role !== 'ADMIN' && lease.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  const updated = await prisma.lease.update({
    where: { id },
    data: { active: false, endDate: new Date() },
  });
  await prisma.property.update({ where: { id: lease.propertyId }, data: { status: 'AVAILABLE' } });
  res.json({ lease: updated });
});

export default router;
