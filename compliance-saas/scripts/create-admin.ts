import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    // Get the default organization
    const defaultOrg = await prisma.organization.findUnique({
      where: { name: 'Default Organization' },
    });

    if (!defaultOrg) {
      throw new Error('Default organization not found. Please run setup-db.ts first.');
    }

    // Get the admin role
    const adminRole = await prisma.role.findFirst({
      where: {
        name: 'Admin',
        organizationId: defaultOrg.id,
      },
    });

    if (!adminRole) {
      throw new Error('Admin role not found. Please run setup-db.ts first.');
    }

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // You should change this in production

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin User',
          roleId: adminRole.id,
          organizationId: defaultOrg.id,
        },
      });

      console.log('Admin user created successfully');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('User ID:', adminUser.id);
    } else {
      // Update existing admin user to ensure they have the correct role and organization
      const updatedAdmin = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          roleId: adminRole.id,
          organizationId: defaultOrg.id,
        },
      });

      console.log('Admin user already exists - updated role and organization');
      console.log('Email:', adminEmail);
      console.log('User ID:', updatedAdmin.id);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
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
