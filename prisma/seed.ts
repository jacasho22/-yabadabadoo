import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create a camper
  const camper = await prisma.camper.upsert({
    where: { slug: 'camper-yaba-1' },
    update: {},
    create: {
      name: 'Camper Yaba Adventure',
      slug: 'camper-yaba-1',
      descriptionEs: 'Un camper completo para tus aventuras! Equipado con todo lo que necesitas para disfrutar de la naturaleza.',
      descriptionEn: 'A complete camper for your adventures! Equipped with everything you need to enjoy nature.',
      features: {
        beds: 2,
        kitchen: true,
        shower: true,
        toilet: true,
        heating: true,
        ac: false,
      },
      images: [
        '/images/camper-side.jpeg',
        '/images/camper-interior.jpeg',
        '/images/camper-rear.jpeg',
        '/images/camper-awning.jpeg',
      ],
      pricePerDay: 14000, // 140€ in cents
      pricePerWeek: 98000, // 980€
      pricePerMonth: 420000, // 4200€
      active: true,
    },
  });

  console.log('Camper created:', camper);
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
