import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hash = (p) => bcrypt.hashSync(p, 10);

// Unsplash property photo pools (stable ids)
const houseImgs = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
];
const img = (i) => `${houseImgs[i % houseImgs.length]}?auto=format&fit=crop&w=1200&q=70`;

async function main() {
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const admin = await prisma.user.create({
    data: { name: 'Alex Admin', email: 'admin@rentconnect.com', password: hash('password123'), role: 'ADMIN', phone: '555-0100', city: 'New York', bio: 'Platform administrator.' },
  });

  const owners = await Promise.all(
    [
      { name: 'Olivia Owner', email: 'owner@rentconnect.com', city: 'New York', phone: '555-0101', bio: 'Property manager with 12 units across NYC.' },
      { name: 'Marcus Reed', email: 'marcus@rentconnect.com', city: 'Austin', phone: '555-0102', bio: 'Family-run rentals in Austin.' },
      { name: 'Priya Sharma', email: 'priya@rentconnect.com', city: 'Seattle', phone: '555-0103', bio: 'Modern apartments in the Pacific Northwest.' },
    ].map((o) => prisma.user.create({ data: { ...o, password: hash('password123'), role: 'OWNER', avatar: `https://i.pravatar.cc/150?u=${o.email}` } }))
  );

  const tenants = await Promise.all(
    [
      { name: 'Tina Tenant', email: 'tenant@rentconnect.com', city: 'New York', phone: '555-0201', bio: 'Software engineer relocating for work.' },
      { name: 'David Chen', email: 'david@rentconnect.com', city: 'Austin', phone: '555-0202', bio: 'Graduate student, quiet and tidy.' },
      { name: 'Sara Lopez', email: 'sara@rentconnect.com', city: 'Seattle', phone: '555-0203', bio: 'Nurse looking for a place near downtown.' },
      { name: 'James Kim', email: 'james@rentconnect.com', city: 'New York', phone: '555-0204', bio: 'Marketing professional with a small dog.' },
    ].map((t) => prisma.user.create({ data: { ...t, password: hash('password123'), role: 'TENANT', avatar: `https://i.pravatar.cc/150?u=${t.email}` } }))
  );

  console.log('Creating properties...');
  const AMEN = ['WiFi', 'Air Conditioning', 'Heating', 'Washer', 'Dryer', 'Gym', 'Pool', 'Elevator', 'Pet Friendly', 'Balcony', 'Dishwasher', 'Security'];
  const TYPES = ['Apartment', 'House', 'Studio', 'Villa', 'Condo'];
  const cities = { 0: 'New York', 1: 'Austin', 2: 'Seattle' };

  const propertyDefs = [
    { title: 'Sunlit Downtown Loft', city: 'New York', rent: 3200, beds: 2, baths: 2, type: 'Apartment', furnished: true },
    { title: 'Cozy Brooklyn Studio', city: 'New York', rent: 1900, beds: 1, baths: 1, type: 'Studio', furnished: true },
    { title: 'Elegant Upper East Condo', city: 'New York', rent: 4100, beds: 3, baths: 2, type: 'Condo', furnished: false },
    { title: 'Modern Manhattan 1BR', city: 'New York', rent: 2600, beds: 1, baths: 1, type: 'Apartment', furnished: false },
    { title: 'Hill Country Villa', city: 'Austin', rent: 3800, beds: 4, baths: 3, type: 'Villa', furnished: true },
    { title: 'South Congress Bungalow', city: 'Austin', rent: 2400, beds: 2, baths: 1, type: 'House', furnished: false },
    { title: 'Riverside Austin Apartment', city: 'Austin', rent: 2100, beds: 2, baths: 2, type: 'Apartment', furnished: true },
    { title: 'Capitol View Studio', city: 'Austin', rent: 1500, beds: 1, baths: 1, type: 'Studio', furnished: true },
    { title: 'Capitol Hill Townhouse', city: 'Seattle', rent: 3300, beds: 3, baths: 2, type: 'House', furnished: false },
    { title: 'Belltown Skyline Condo', city: 'Seattle', rent: 2900, beds: 2, baths: 2, type: 'Condo', furnished: true },
    { title: 'Fremont Garden Apartment', city: 'Seattle', rent: 2200, beds: 1, baths: 1, type: 'Apartment', furnished: false },
    { title: 'Lakeview Family Home', city: 'Seattle', rent: 4200, beds: 4, baths: 3, type: 'House', furnished: true },
  ];

  const ownerByCity = { 'New York': owners[0].id, Austin: owners[1].id, Seattle: owners[2].id };

  const properties = [];
  for (let i = 0; i < propertyDefs.length; i++) {
    const d = propertyDefs[i];
    const amenities = AMEN.filter((_, idx) => (i + idx) % 3 === 0).join(', ');
    const p = await prisma.property.create({
      data: {
        ownerId: ownerByCity[d.city],
        title: d.title,
        address: `${100 + i * 7} ${['Main', 'Oak', 'Pine', 'Cedar', 'Elm', 'Maple'][i % 6]} St`,
        city: d.city,
        monthlyRent: d.rent,
        securityDeposit: d.rent,
        bedrooms: d.beds,
        bathrooms: d.baths,
        furnished: d.furnished,
        parking: i % 2 === 0,
        propertyType: d.type,
        amenities,
        description: `A beautiful ${d.type.toLowerCase()} in the heart of ${d.city}. Featuring ${d.beds} bedroom(s), ${d.baths} bathroom(s), and premium finishes throughout. Close to public transit, restaurants, and parks. Perfect for professionals and families alike.`,
        images: { create: [{ url: img(i) }, { url: img(i + 3) }, { url: img(i + 6) }] },
      },
    });
    properties.push(p);
  }

  console.log('Creating leases, requests, payments, complaints...');

  // Lease #1: Tina rents the Sunlit Downtown Loft (owner Olivia)
  const loft = properties[0];
  const lease1 = await prisma.lease.create({
    data: { propertyId: loft.id, tenantId: tenants[0].id, ownerId: loft.ownerId, rent: loft.monthlyRent, deposit: loft.securityDeposit },
  });
  await prisma.property.update({ where: { id: loft.id }, data: { status: 'OCCUPIED' } });

  // Lease #2: David rents South Congress Bungalow (owner Marcus)
  const bungalow = properties[5];
  const lease2 = await prisma.lease.create({
    data: { propertyId: bungalow.id, tenantId: tenants[1].id, ownerId: bungalow.ownerId, rent: bungalow.monthlyRent, deposit: bungalow.securityDeposit },
  });
  await prisma.property.update({ where: { id: bungalow.id }, data: { status: 'OCCUPIED' } });

  // Lease #3: Sara rents Fremont Garden Apartment (owner Priya)
  const fremont = properties[10];
  const lease3 = await prisma.lease.create({
    data: { propertyId: fremont.id, tenantId: tenants[2].id, ownerId: fremont.ownerId, rent: fremont.monthlyRent, deposit: fremont.securityDeposit },
  });
  await prisma.property.update({ where: { id: fremont.id }, data: { status: 'OCCUPIED' } });

  // Payments: history for each lease
  const now = new Date();
  const mkDate = (monthOffset, day = 1) => new Date(now.getFullYear(), now.getMonth() + monthOffset, day);
  async function seedPayments(lease) {
    // 3 past paid months, current pending, one overdue
    const rows = [
      { dueDate: mkDate(-3), status: 'PAID', paidDate: mkDate(-3, 3), method: 'Bank Transfer' },
      { dueDate: mkDate(-2), status: 'PAID', paidDate: mkDate(-2, 2), method: 'Card' },
      { dueDate: mkDate(-1), status: 'PAID', paidDate: mkDate(-1, 5), method: 'Online' },
      { dueDate: mkDate(0, 5), status: 'PENDING', paidDate: null, method: null },
    ];
    for (const r of rows) {
      await prisma.payment.create({
        data: { leaseId: lease.id, propertyId: lease.propertyId, tenantId: lease.tenantId, amount: lease.rent, ...r },
      });
    }
  }
  await seedPayments(lease1);
  await seedPayments(lease2);
  await seedPayments(lease3);

  // Add one overdue payment for lease1
  await prisma.payment.create({
    data: { leaseId: lease1.id, propertyId: lease1.propertyId, tenantId: lease1.tenantId, amount: lease1.rent, dueDate: mkDate(-1, 1), status: 'OVERDUE' },
  });

  // Rental requests
  await prisma.rentalRequest.create({
    data: { propertyId: properties[1].id, tenantId: tenants[3].id, message: 'Hi, I love this studio and can move in immediately. Stable income, references available.', status: 'PENDING' },
  });
  await prisma.rentalRequest.create({
    data: { propertyId: properties[2].id, tenantId: tenants[0].id, message: 'Interested in a longer lease for this condo.', status: 'PENDING' },
  });
  await prisma.rentalRequest.create({
    data: { propertyId: properties[6].id, tenantId: tenants[1].id, message: 'Looking to relocate next month.', status: 'PENDING' },
  });
  await prisma.rentalRequest.create({
    data: { propertyId: properties[9].id, tenantId: tenants[2].id, message: 'Is this still available?', status: 'REJECTED' },
  });
  await prisma.rentalRequest.create({
    data: { propertyId: loft.id, tenantId: tenants[0].id, message: 'Original accepted application.', status: 'ACCEPTED' },
  });

  // Complaints
  await prisma.complaint.create({
    data: { propertyId: loft.id, tenantId: tenants[0].id, title: 'Leaking kitchen faucet', description: 'The kitchen faucet has been dripping for a few days.', category: 'Plumbing', priority: 'Medium', status: 'OPEN' },
  });
  await prisma.complaint.create({
    data: { propertyId: bungalow.id, tenantId: tenants[1].id, title: 'Heating not working', description: 'The heater stopped working last night.', category: 'HVAC', priority: 'High', status: 'IN_PROGRESS' },
  });
  await prisma.complaint.create({
    data: { propertyId: fremont.id, tenantId: tenants[2].id, title: 'Broken light fixture', description: 'Living room ceiling light flickers.', category: 'Electrical', priority: 'Low', status: 'RESOLVED' },
  });

  // Announcements
  await prisma.announcement.create({
    data: { ownerId: owners[0].id, propertyId: loft.id, title: 'Building maintenance on Saturday', body: 'Water will be shut off from 9am-12pm for scheduled maintenance.' },
  });
  await prisma.announcement.create({
    data: { ownerId: owners[1].id, title: 'Rent portal upgrade', body: 'We upgraded the online payment portal - please use the new Pay Rent button.' },
  });

  // Notifications
  await prisma.notification.create({ data: { userId: owners[0].id, title: 'New rental request', message: 'James Kim requested to rent "Cozy Brooklyn Studio".', type: 'request', link: '/owner/requests' } });
  await prisma.notification.create({ data: { userId: tenants[0].id, title: 'Rent due soon', message: 'Your rent for "Sunlit Downtown Loft" is due on the 5th.', type: 'payment', link: '/tenant/payments' } });
  await prisma.notification.create({ data: { userId: tenants[0].id, title: 'Request accepted', message: 'Your application for "Sunlit Downtown Loft" was accepted.', type: 'success', link: '/tenant/applications' } });
  await prisma.notification.create({ data: { userId: owners[1].id, title: 'New complaint', message: 'David Chen reported: "Heating not working".', type: 'complaint', link: '/owner/complaints' } });

  console.log('Seed complete!');
  console.log('\nLogin credentials (password: password123):');
  console.log('  Admin:  admin@rentconnect.com');
  console.log('  Owner:  owner@rentconnect.com');
  console.log('  Tenant: tenant@rentconnect.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
