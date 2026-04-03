/// <reference types="node" />
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

// Proper UUID v4 format for seeded cafés
const CAFE_IDS = {
  theGrind: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  brewAndCo: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  kopiKaki:  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
};

async function main() {
  console.log('Seeding database...');

  // ─── Cafes ────────────────────────────────────────────────────────────────
  await prisma.cafe.upsert({
    where: { id: CAFE_IDS.theGrind },
    update: {},
    create: {
      id: CAFE_IDS.theGrind,
      name: 'The Grind',
      description: 'Specialty coffee and artisan pastries in the heart of the city.',
      location: 'CBD',
    },
  });

  await prisma.cafe.upsert({
    where: { id: CAFE_IDS.brewAndCo },
    update: {},
    create: {
      id: CAFE_IDS.brewAndCo,
      name: 'Brew & Co',
      description: 'Cosy neighbourhood cafe known for cold brews and waffles.',
      location: 'Tampines',
    },
  });

  await prisma.cafe.upsert({
    where: { id: CAFE_IDS.kopiKaki },
    update: {},
    create: {
      id: CAFE_IDS.kopiKaki,
      name: 'Kopi Kaki',
      description: 'Traditional kopi with a modern twist, rooted in local culture.',
      location: 'Jurong',
    },
  });

  console.log('Cafes seeded:', Object.keys(CAFE_IDS).join(', '));

  // ─── Employees ────────────────────────────────────────────────────────────
  const employees: Array<{
    id: string;
    name: string;
    emailAddress: string;
    phoneNumber: string;
    gender: Gender;
    cafeId: string | null;
    startDate: Date | null;
  }> = [
    {
      id: 'UIABCD001',
      name: 'Alice Tan',
      emailAddress: 'alice.tan@example.com',
      phoneNumber: '91234567',
      gender: Gender.Female,
      cafeId: CAFE_IDS.theGrind,
      startDate: new Date('2023-01-15'),
    },
    {
      id: 'UIABCD002',
      name: 'Bob Lim',
      emailAddress: 'bob.lim@example.com',
      phoneNumber: '81234567',
      gender: Gender.Male,
      cafeId: CAFE_IDS.theGrind,
      startDate: new Date('2023-06-01'),
    },
    {
      id: 'UIABCD003',
      name: 'Carol Ng',
      emailAddress: 'carol.ng@example.com',
      phoneNumber: '92345678',
      gender: Gender.Female,
      cafeId: CAFE_IDS.theGrind,
      startDate: new Date('2024-03-10'),
    },
    {
      id: 'UIABCD004',
      name: 'David Koh',
      emailAddress: 'david.koh@example.com',
      phoneNumber: '83456789',
      gender: Gender.Male,
      cafeId: CAFE_IDS.brewAndCo,
      startDate: new Date('2022-11-20'),
    },
    {
      id: 'UIABCD005',
      name: 'Eva Wong',
      emailAddress: 'eva.wong@example.com',
      phoneNumber: '94567890',
      gender: Gender.Female,
      cafeId: CAFE_IDS.brewAndCo,
      startDate: new Date('2024-07-01'),
    },
    {
      id: 'UIABCD006',
      name: 'Frank Ong',
      emailAddress: 'frank.ong@example.com',
      phoneNumber: '85678901',
      gender: Gender.Male,
      cafeId: CAFE_IDS.kopiKaki,
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
        create: { employeeId: employeeData.id, cafeId, startDate },
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
