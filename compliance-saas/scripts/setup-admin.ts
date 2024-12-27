import { hash } from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@arborra.com' },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: 'Default Organization',
      },
    });

    // Create admin user
    const hashedPassword = await hash('admin123', 12);
    const user = await prisma.user.create({
      data: {
        email: 'admin@arborra.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        organizationId: organization.id,
      },
    });

    console.log('Created admin user:', user.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
