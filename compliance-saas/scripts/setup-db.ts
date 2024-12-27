import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Create default organization if it doesn't exist
    const defaultOrg = await prisma.organization.upsert({
      where: {
        name: "Default Organization"
      },
      update: {},
      create: {
        name: "Default Organization"
      }
    });

    // Create admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: {
        email: "admin@arborra.com"
      },
      update: {},
      create: {
        email: "admin@arborra.com",
        name: "Admin User",
        password: "$2a$10$GQH8AKNW0Ot0TxVxs1w3/.2hG4zqDbX6RDX.F4yyhT5NOYpDM/Xz6", // "admin123"
        role: "ADMIN",
        organizationId: defaultOrg.id
      }
    });

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
