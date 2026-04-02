import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Cafes ────────────────────────────────────────────────────────────────
  const cafe1 = await prisma.cafe.upsert({
    where: { id: 'a1b2c3d4-0001-0001-0001-000000000001' },
    update: {},
    create: {
      id: 'a1b2c3d4-0001-0001-0001-000000000001',
      name: 'The Grind',
      description: 'Specialty coffee and artisan pastries in the heart of the city.',
      location: 'CBD',
    },
  });

  const cafe2 = await prisma.cafe.upsert({
    where: { id: 'a1b2c3d4-0002-0002-0002-000000000002' },
    update: {},
    create: {
      id: 'a1b2c3d4-0002-0002-0002-000000000002',
      name: 'Brew & Co',
      description: 'Cosy neighbourhood cafe known for cold brews and waffles.',
      location: 'Tampines',
    },
  });

  const cafe3 = await prisma.cafe.upsert({
    where: { id: 'a1b2c3d4-0003-0003-0003-000000000003' },
    update: {},
    create: {
      id: 'a1b2c3d4-0003-0003-0003-000000000003',
      name: 'Kopi Kaki',
      description: 'Traditional kopi with a modern twist, rooted in local culture.',
      location: 'Jurong',
    },
  });

  console.log('Cafes seeded:', cafe1.name, cafe2.name, cafe3.name);

  // ─── Employees ────────────────────────────────────────────────────────────
  const employees = [
    {
      id: 'UIABCD001',
      name: 'Alice Tan',
      emailAddress: 'alice.tan@example.com',
      phoneNumber: '91234567',
      gender: Gender.Female,
      cafeId: cafe1.id,
      startDate: new Date('2023-01-15'),
    },
    {
      id: 'UIABCD002',
      name: 'Bob Lim',
      emailAddress: 'bob.lim@example.com',
      phoneNumber: '81234567',
      gender: Gender.Male,
      cafeId: cafe1.id,
      startDate: new Date('2023-06-01'),
    },
    {
      id: 'UIABCD003',
      name: 'Carol Ng',
      emailAddress: 'carol.ng@example.com',
      phoneNumber: '92345678',
      gender: Gender.Female,
      cafeId: cafe1.id,
      startDate: new Date('2024-03-10'),
    },
    {
      id: 'UIABCD004',
      name: 'David Koh',
      emailAddress: 'david.koh@example.com',
      phoneNumber: '83456789',
      gender: Gender.Male,
      cafeId: cafe2.id,
      startDate: new Date('2022-11-20'),
    },
    {
      id: 'UIABCD005',
      name: 'Eva Wong',
      emailAddress: 'eva.wong@example.com',
      phoneNumber: '94567890',
      gender: Gender.Female,
      cafeId: cafe2.id,
      startDate: new Date('2024-07-01'),
    },
    {
      id: 'UIABCD006',
      name: 'Frank Ong',
      emailAddress: 'frank.ong@example.com',
      phoneNumber: '85678901',
      gender: Gender.Male,
      cafeId: cafe3.id,
      startDate: new Date('2023-09-15'),
    },
    // Unassigned employees
    {
      id: 'UIABCD007',
      name: 'Grace Lee',
      emailAddress: 'grace.lee@example.com',
      phoneNumber: '96789012',
      gender: Gender.Female,
      cafeId: null,
      startDate: null,
    },
    {
      id: 'UIABCD008',
      name: 'Henry Chua',
      emailAddress: 'henry.chua@example.com',
      phoneNumber: '87890123',
      gender: Gender.Male,
      cafeId: null,
      startDate: null,
    },
  ];

  for (const emp of employees) {
    const { cafeId, startDate, ...employeeData } = emp;

    await prisma.employee.upsert({
      where: { id: employeeData.id },
      update: {},
      create: employeeData,
    });

    if (cafeId && startDate) {
      await prisma.cafeEmployee.upsert({
        where: { employeeId: employeeData.id },
        update: {},
        create: {
          employeeId: employeeData.id,
          cafeId,
          startDate,
        },
      });
    }
  }

  console.log(`Employees seeded: ${employees.length} total (${employees.filter(e => e.cafeId).length} assigned, ${employees.filter(e => !e.cafeId).length} unassigned)`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
