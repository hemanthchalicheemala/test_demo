import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

function isOverdue(p) {
  return p.status === 'OVERDUE' || (p.status === 'PENDING' && new Date(p.dueDate) < new Date());
}

// Owner dashboard stats
router.get('/owner', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const ownerId = req.user.id;
  const properties = await prisma.property.findMany({ where: { ownerId } });
  const propertyIds = properties.map((p) => p.id);

  const [leases, pendingRequests, payments, openComplaints] = await Promise.all([
    prisma.lease.findMany({ where: { ownerId, active: true } }),
    prisma.rentalRequest.count({ where: { property: { ownerId }, status: 'PENDING' } }),
    prisma.payment.findMany({ where: { propertyId: { in: propertyIds.length ? propertyIds : [-1] } } }),
    prisma.complaint.count({ where: { property: { ownerId }, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
  ]);

  const pendingRent = payments
    .filter((p) => p.status !== 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const collectedRent = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  // Monthly collected rent for chart (last 6 months)
  const revenueByMonth = buildMonthlySeries(payments.filter((p) => p.status === 'PAID' && p.paidDate), 'paidDate');

  res.json({
    stats: {
      totalProperties: properties.length,
      available: properties.filter((p) => p.status === 'AVAILABLE').length,
      occupied: properties.filter((p) => p.status === 'OCCUPIED').length,
      totalTenants: new Set(leases.map((l) => l.tenantId)).size,
      pendingRequests,
      pendingRent,
      collectedRent,
      openComplaints,
    },
    revenueByMonth,
    propertyStatus: [
      { name: 'Available', value: properties.filter((p) => p.status === 'AVAILABLE').length },
      { name: 'Occupied', value: properties.filter((p) => p.status === 'OCCUPIED').length },
    ],
  });
});

// Tenant dashboard stats
router.get('/tenant', authenticate, async (req, res) => {
  const tenantId = req.user.id;
  const [requests, leases, payments, openComplaints] = await Promise.all([
    prisma.rentalRequest.findMany({ where: { tenantId } }),
    prisma.lease.findMany({
      where: { tenantId, active: true },
      include: { property: { include: { images: true } } },
    }),
    prisma.payment.findMany({ where: { tenantId }, orderBy: { dueDate: 'asc' } }),
    prisma.complaint.count({ where: { tenantId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
  ]);

  const nextDue = payments.find((p) => p.status !== 'PAID');
  const paidHistory = buildMonthlySeries(payments.filter((p) => p.status === 'PAID' && p.paidDate), 'paidDate');
  const totalPaid = payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);

  res.json({
    stats: {
      applications: requests.length,
      pendingApplications: requests.filter((r) => r.status === 'PENDING').length,
      currentRentals: leases.length,
      nextRentDue: nextDue ? { amount: nextDue.amount, dueDate: nextDue.dueDate, status: isOverdue(nextDue) ? 'OVERDUE' : nextDue.status } : null,
      totalPaid,
      openComplaints,
    },
    currentRental: leases[0] || null,
    paidHistory,
    applicationBreakdown: [
      { name: 'Pending', value: requests.filter((r) => r.status === 'PENDING').length },
      { name: 'Accepted', value: requests.filter((r) => r.status === 'ACCEPTED').length },
      { name: 'Rejected', value: requests.filter((r) => r.status === 'REJECTED').length },
      { name: 'Cancelled', value: requests.filter((r) => r.status === 'CANCELLED').length },
    ],
  });
});

// Admin platform stats
router.get('/admin', authenticate, authorize('ADMIN'), async (req, res) => {
  const [users, owners, tenants, properties, requests, payments, complaints] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.user.count({ where: { role: 'TENANT' } }),
    prisma.property.findMany(),
    prisma.rentalRequest.findMany(),
    prisma.payment.findMany(),
    prisma.complaint.findMany(),
  ]);

  const revenueByMonth = buildMonthlySeries(payments.filter((p) => p.status === 'PAID' && p.paidDate), 'paidDate');

  res.json({
    stats: {
      totalUsers: users,
      owners,
      tenants,
      totalProperties: properties.length,
      available: properties.filter((p) => p.status === 'AVAILABLE').length,
      occupied: properties.filter((p) => p.status === 'OCCUPIED').length,
      pendingListings: properties.filter((p) => !p.approved).length,
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === 'PENDING').length,
      openComplaints: complaints.filter((c) => c.status !== 'RESOLVED').length,
      totalRevenue: payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amount, 0),
    },
    revenueByMonth,
    requestBreakdown: [
      { name: 'Pending', value: requests.filter((r) => r.status === 'PENDING').length },
      { name: 'Accepted', value: requests.filter((r) => r.status === 'ACCEPTED').length },
      { name: 'Rejected', value: requests.filter((r) => r.status === 'REJECTED').length },
      { name: 'Cancelled', value: requests.filter((r) => r.status === 'CANCELLED').length },
    ],
    complaintBreakdown: [
      { name: 'Open', value: complaints.filter((c) => c.status === 'OPEN').length },
      { name: 'In Progress', value: complaints.filter((c) => c.status === 'IN_PROGRESS').length },
      { name: 'Resolved', value: complaints.filter((c) => c.status === 'RESOLVED').length },
    ],
  });
});

function buildMonthlySeries(items, dateField) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('default', { month: 'short' }), value: 0 });
  }
  for (const item of items) {
    const d = new Date(item[dateField]);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.value += item.amount;
  }
  return months.map(({ label, value }) => ({ label, value }));
}

export default router;
