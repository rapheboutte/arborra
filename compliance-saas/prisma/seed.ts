import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create initial organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Arborra',
    },
  });

  // Create organization settings
  await prisma.settings.create({
    data: {
      organizationId: organization.id,
      companyName: 'Arborra',
      companyEmail: 'admin@arborra.com',
      companySize: '10-50',
      gdprEnabled: true,
      hipaaEnabled: true,
      soxEnabled: true,
      ccpaEnabled: true,
      oshaEnabled: true,
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@arborra.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: organization.id,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
