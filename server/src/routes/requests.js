import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { notify } from '../lib/notify.js';

const router = Router();

const include = {
  property: { include: { images: true, owner: { select: { id: true, name: true } } } },
  tenant: { select: { id: true, name: true, email: true, phone: true, city: true, avatar: true, bio: true } },
};

// Tenant: my applications
router.get('/mine', authenticate, async (req, res) => {
  const requests = await prisma.rentalRequest.findMany({
    where: { tenantId: req.user.id },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ requests });
});

// Owner: requests for my properties
router.get('/received', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const requests = await prisma.rentalRequest.findMany({
    where: { property: { ownerId: req.user.id } },
    include,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ requests });
});

// Admin: all requests
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const requests = await prisma.rentalRequest.findMany({ include, orderBy: { createdAt: 'desc' } });
  res.json({ requests });
});

// Tenant: create a rental request
router.post('/', authenticate, authorize('TENANT'), async (req, res) => {
  const { propertyId, message } = req.body;
  const property = await prisma.property.findUnique({ where: { id: Number(propertyId) } });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const existing = await prisma.rentalRequest.findFirst({
    where: { propertyId: Number(propertyId), tenantId: req.user.id, status: 'PENDING' },
  });
  if (existing) return res.status(409).json({ error: 'You already have a pending request for this property' });

  const request = await prisma.rentalRequest.create({
    data: { propertyId: Number(propertyId), tenantId: req.user.id, message: message || '' },
    include,
  });

  await notify({
    userId: property.ownerId,
    title: 'New rental request',
    message: `${req.user.name} requested to rent "${property.title}"`,
    type: 'request',
    link: '/owner/requests',
  });

  res.status(201).json({ request });
});

// Owner: accept / reject; Tenant: cancel
router.patch('/:id/status', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // ACCEPTED | REJECTED | CANCELLED
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true },
  });
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const isOwner = request.property.ownerId === req.user.id;
  const isTenant = request.tenantId === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (status === 'CANCELLED' && !(isTenant || isAdmin)) {
    return res.status(403).json({ error: 'Only the tenant can cancel' });
  }
  if ((status === 'ACCEPTED' || status === 'REJECTED') && !(isOwner || isAdmin)) {
    return res.status(403).json({ error: 'Only the owner can accept/reject' });
  }

  const updated = await prisma.rentalRequest.update({
    where: { id },
    data: { status },
    include,
  });

  if (status === 'ACCEPTED') {
    // Create an active lease and mark property occupied
    const lease = await prisma.lease.create({
      data: {
        propertyId: request.propertyId,
        tenantId: request.tenantId,
        ownerId: request.property.ownerId,
        rent: request.property.monthlyRent,
        deposit: request.property.securityDeposit,
      },
    });
    await prisma.property.update({ where: { id: request.propertyId }, data: { status: 'OCCUPIED' } });

    // Reject other pending requests for the same property
    await prisma.rentalRequest.updateMany({
      where: { propertyId: request.propertyId, status: 'PENDING', id: { not: id } },
      data: { status: 'REJECTED' },
    });

    // Create first month's rent payment (due in ~30 days)
    const due = new Date();
    due.setDate(due.getDate() + 30);
    await prisma.payment.create({
      data: {
        leaseId: lease.id,
        propertyId: request.propertyId,
        tenantId: request.tenantId,
        amount: request.property.monthlyRent,
        dueDate: due,
        status: 'PENDING',
      },
    });

    await notify({
      userId: request.tenantId,
      title: 'Request accepted',
      message: `Your request for "${request.property.title}" was accepted. Welcome home!`,
      type: 'success',
      link: '/tenant/applications',
    });
  } else if (status === 'REJECTED') {
    await notify({
      userId: request.tenantId,
      title: 'Request rejected',
      message: `Your request for "${request.property.title}" was rejected.`,
      type: 'warning',
      link: '/tenant/applications',
    });
  } else if (status === 'CANCELLED') {
    await notify({
      userId: request.property.ownerId,
      title: 'Request cancelled',
      message: `${req.user.name} cancelled their request for "${request.property.title}".`,
      type: 'info',
      link: '/owner/requests',
    });
  }

  res.json({ request: updated });
});

export default router;
