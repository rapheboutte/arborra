import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Create default organization if it doesn't exist
    const defaultOrg = await prisma.organization.upsert({
      where: { name: 'Default Organization' },
      update: {},
      create: {
        name: 'Default Organization',
        description: 'Default organization created during setup',
      },
    });

    // Create admin role if it doesn't exist
    const adminRole = await prisma.role.upsert({
      where: {
        name_organizationId: {
          name: 'Admin',
          organizationId: defaultOrg.id,
        },
      },
      update: {},
      create: {
        name: 'Admin',
        description: 'Administrator role with full access',
        organizationId: defaultOrg.id,
      },
    });

    // Update existing users without organization to use default org
    await prisma.user.updateMany({
      where: {
        organizationId: null,
      },
      data: {
        organizationId: defaultOrg.id,
      },
    });

    console.log('Database setup completed successfully');
    console.log('Default organization created with ID:', defaultOrg.id);
    console.log('Admin role created with ID:', adminRole.id);
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
