import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

const propertyInclude = {
  images: true,
  owner: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
  _count: { select: { requests: true, complaints: true } },
};

// List / search properties with filters
router.get('/', optionalAuth, async (req, res) => {
  const {
    city,
    minRent,
    maxRent,
    bedrooms,
    bathrooms,
    furnished,
    propertyType,
    amenities,
    status,
    ownerId,
    q,
  } = req.query;

  const where = { approved: true };

  if (city) where.city = { contains: String(city) };
  if (q) {
    where.OR = [
      { title: { contains: String(q) } },
      { address: { contains: String(q) } },
      { city: { contains: String(q) } },
      { description: { contains: String(q) } },
    ];
  }
  if (minRent) where.monthlyRent = { ...(where.monthlyRent || {}), gte: Number(minRent) };
  if (maxRent) where.monthlyRent = { ...(where.monthlyRent || {}), lte: Number(maxRent) };
  if (bedrooms) where.bedrooms = { gte: Number(bedrooms) };
  if (bathrooms) where.bathrooms = { gte: Number(bathrooms) };
  if (furnished === 'true') where.furnished = true;
  if (furnished === 'false') where.furnished = false;
  if (propertyType) where.propertyType = String(propertyType);
  if (status) where.status = String(status);
  if (ownerId) where.ownerId = Number(ownerId);

  let properties = await prisma.property.findMany({
    where,
    include: propertyInclude,
    orderBy: { createdAt: 'desc' },
  });

  // Amenities filter (comma separated, all must be present)
  if (amenities) {
    const wanted = String(amenities)
      .split(',')
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);
    properties = properties.filter((p) => {
      const have = p.amenities.toLowerCase();
      return wanted.every((a) => have.includes(a));
    });
  }

  res.json({ properties });
});

// Owner: list own properties (including unapproved)
router.get('/mine', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const properties = await prisma.property.findMany({
    where: { ownerId: req.user.id },
    include: { ...propertyInclude, leases: { where: { active: true }, include: { tenant: { select: { id: true, name: true, email: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ properties });
});

// Single property detail
router.get('/:id', optionalAuth, async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      ...propertyInclude,
      leases: { where: { active: true }, include: { tenant: { select: { id: true, name: true } } } },
    },
  });
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json({ property });
});

// Create property (owner)
router.post('/', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const {
    title, address, city, monthlyRent, securityDeposit, bedrooms, bathrooms,
    furnished, parking, propertyType, amenities, description, images,
  } = req.body;

  if (!title || !address || !city || monthlyRent == null) {
    return res.status(400).json({ error: 'title, address, city and monthlyRent are required' });
  }

  const property = await prisma.property.create({
    data: {
      ownerId: req.user.id,
      title,
      address,
      city,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit || 0),
      bedrooms: Number(bedrooms || 1),
      bathrooms: Number(bathrooms || 1),
      furnished: Boolean(furnished),
      parking: Boolean(parking),
      propertyType: propertyType || 'Apartment',
      amenities: Array.isArray(amenities) ? amenities.join(', ') : (amenities || ''),
      description: description || '',
      images: {
        create: (Array.isArray(images) ? images : []).filter(Boolean).map((url) => ({ url })),
      },
    },
    include: propertyInclude,
  });
  res.status(201).json({ property });
});

// Update property (owner of it, or admin)
router.put('/:id', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Property not found' });
  if (req.user.role !== 'ADMIN' && existing.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your property' });
  }

  const {
    title, address, city, monthlyRent, securityDeposit, bedrooms, bathrooms,
    furnished, parking, propertyType, amenities, description, status, images,
  } = req.body;

  const data = {
    title, address, city,
    monthlyRent: monthlyRent != null ? Number(monthlyRent) : undefined,
    securityDeposit: securityDeposit != null ? Number(securityDeposit) : undefined,
    bedrooms: bedrooms != null ? Number(bedrooms) : undefined,
    bathrooms: bathrooms != null ? Number(bathrooms) : undefined,
    furnished: furnished != null ? Boolean(furnished) : undefined,
    parking: parking != null ? Boolean(parking) : undefined,
    propertyType,
    amenities: amenities != null ? (Array.isArray(amenities) ? amenities.join(', ') : amenities) : undefined,
    description,
    status,
  };

  // Replace images if provided
  if (Array.isArray(images)) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    data.images = { create: images.filter(Boolean).map((url) => ({ url })) };
  }

  const property = await prisma.property.update({ where: { id }, data, include: propertyInclude });
  res.json({ property });
});

// Delete property
router.delete('/:id', authenticate, authorize('OWNER', 'ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Property not found' });
  if (req.user.role !== 'ADMIN' && existing.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your property' });
  }
  await prisma.property.delete({ where: { id } });
  res.json({ ok: true });
});

// Admin: approve / unapprove listing
router.patch('/:id/approval', authenticate, authorize('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { approved } = req.body;
  const property = await prisma.property.update({
    where: { id },
    data: { approved: Boolean(approved) },
  });
  res.json({ property });
});

export default router;
