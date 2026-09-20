import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { notify } from '../lib/notify.js';

const router = Router();

const include = {
  property: { select: { id: true, title: true, city: true, ownerId: true } },
  tenant: { select: { id: true, name: true, email: true } },
};

// Recompute OVERDUE status on read
function withOverdue(p) {
  if (p.status === 'PENDING' && new Date(p.dueDate) < new Date()) {
    return { ...p, status: 'OVERDUE' };
  }
  return p;
}

// Tenant: my payments
router.get('/mine', authenticate, async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { tenantId: req.user.id },
    include,
    orderBy: { dueDate: 'desc' },
  });
  res.json({ payments: payments.map(withOverdue) });
});

// Owner: payments across my properties
router.get('/received', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { property: { ownerId: req.user.id } },
    include,
    orderBy: { dueDate: 'desc' },
  });
  res.json({ payments: payments.map(withOverdue) });
});

// Admin: all payments
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const payments = await prisma.payment.findMany({ include, orderBy: { dueDate: 'desc' } });
  res.json({ payments: payments.map(withOverdue) });
});

// Owner: record/schedule a rent payment for a tenant
router.post('/', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const { propertyId, tenantId, amount, dueDate, leaseId } = req.body;
  const property = await prisma.property.findUnique({ where: { id: Number(propertyId) } });
  if (!property) return res.status(404).json({ error: 'Property not found' });
  if (req.user.role !== 'ADMIN' && property.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your property' });
  }
  const payment = await prisma.payment.create({
    data: {
      propertyId: Number(propertyId),
      tenantId: Number(tenantId),
      leaseId: leaseId ? Number(leaseId) : null,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      status: 'PENDING',
    },
    include,
  });
  await notify({
    userId: Number(tenantId),
    title: 'New rent invoice',
    message: `Rent of $${Number(amount).toLocaleString()} is due for "${property.title}".`,
    type: 'payment',
    link: '/tenant/payments',
  });
  res.status(201).json({ payment });
});

// Tenant or owner: mark a payment as paid (pay/record)
router.patch('/:id/pay', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { method } = req.body;
  const payment = await prisma.payment.findUnique({ where: { id }, include: { property: true } });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  const isTenant = payment.tenantId === req.user.id;
  const isOwner = payment.property.ownerId === req.user.id;
  if (!(isTenant || isOwner || req.user.role === 'ADMIN')) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const updated = await prisma.payment.update({
    where: { id },
    data: { status: 'PAID', paidDate: new Date(), method: method || 'Online' },
    include,
  });

  await notify({
    userId: payment.property.ownerId,
    title: 'Rent paid',
    message: `A rent payment of $${payment.amount.toLocaleString()} was recorded for "${payment.property.title}".`,
    type: 'payment',
    link: '/owner/payments',
  });

  res.json({ payment: updated });
});

export default router;
