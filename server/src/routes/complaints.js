import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { notify } from '../lib/notify.js';

const router = Router();

const include = {
  property: { select: { id: true, title: true, ownerId: true } },
  tenant: { select: { id: true, name: true, email: true } },
};

// Tenant: my complaints
router.get('/mine', authenticate, async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    where: { tenantId: req.user.id },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ complaints });
});

// Owner: complaints on my properties
router.get('/received', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    where: { property: { ownerId: req.user.id } },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ complaints });
});

// Admin: all complaints
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const complaints = await prisma.complaint.findMany({ include, orderBy: { createdAt: 'desc' } });
  res.json({ complaints });
});

// Tenant: submit complaint
router.post('/', authenticate, authorize('TENANT'), async (req, res) => {
  const { propertyId, title, description, category, priority } = req.body;
  const property = await prisma.property.findUnique({ where: { id: Number(propertyId) } });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const complaint = await prisma.complaint.create({
    data: {
      propertyId: Number(propertyId),
      tenantId: req.user.id,
      title,
      description: description || '',
      category: category || 'General',
      priority: priority || 'Medium',
    },
    include,
  });

  await notify({
    userId: property.ownerId,
    title: 'New maintenance complaint',
    message: `${req.user.name} reported: "${title}"`,
    type: 'complaint',
    link: '/owner/complaints',
  });

  res.status(201).json({ complaint });
});

// Owner/Admin: update complaint status
router.patch('/:id/status', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // OPEN | IN_PROGRESS | RESOLVED
  const complaint = await prisma.complaint.findUnique({ where: { id }, include: { property: true } });
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  if (req.user.role !== 'ADMIN' && complaint.property.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your property' });
  }
  const updated = await prisma.complaint.update({ where: { id }, data: { status }, include });

  await notify({
    userId: complaint.tenantId,
    title: 'Complaint updated',
    message: `Your complaint "${complaint.title}" is now ${status.replace('_', ' ').toLowerCase()}.`,
    type: 'complaint',
    link: '/tenant/complaints',
  });

  res.json({ complaint: updated });
});

export default router;
