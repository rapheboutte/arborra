import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default organization
    const organization = await prisma.organization.create({
      data: {
        id: 'org_default',
        name: 'Default Organization'
      }
    });

    // Create organization settings
    await prisma.organizationSettings.create({
      data: {
        organizationId: organization.id
      }
    });

    // Create default roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'Admin',
        organizationId: organization.id
      }
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'User',
        organizationId: organization.id
      }
    });

    // Create permissions for admin role
    const adminPermissions = [
      'manage_users',
      'manage_roles',
      'manage_compliance',
      'view_compliance',
      'edit_compliance',
      'manage_documents',
      'manage_tasks',
    ];

    for (const permName of adminPermissions) {
      await prisma.permission.create({
        data: {
          name: permName,
          roleId: adminRole.id,
          updatedAt: new Date()
        }
      });
    }

    // Create permissions for user role
    const userPermissions = [
      'view_compliance',
      'edit_compliance',
      'view_documents',
      'upload_documents',
      'view_tasks',
      'edit_tasks',
    ];

    for (const permName of userPermissions) {
      await prisma.permission.create({
        data: {
          name: permName,
          roleId: userRole.id,
          updatedAt: new Date()
        }
      });
    }

    // Create default admin user
    const adminPassword = await hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        organizationId: organization.id,
        roleId: adminRole.id,
        updatedAt: new Date()
      }
    });

    // Create default regular user
    const userPassword = await hash('user123', 12);
    const regularUser = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@example.com',
        password: userPassword,
        organizationId: organization.id,
        roleId: userRole.id,
        updatedAt: new Date()
      }
    });

    // Create compliance frameworks
    const frameworks = [
      {
        name: 'GDPR',
        description: 'General Data Protection Regulation'
      },
      {
        name: 'HIPAA',
        description: 'Health Insurance Portability and Accountability Act'
      },
      {
        name: 'CCPA',
        description: 'California Consumer Privacy Act'
      },
      {
        name: 'SOX',
        description: 'Sarbanes-Oxley Act'
      },
      {
        name: 'OSHA',
        description: 'Occupational Safety and Health Administration'
      }
    ];

    for (const framework of frameworks) {
      await prisma.complianceFramework.create({
        data: {
          name: framework.name,
          description: framework.description,
          organizationId: organization.id,
          updatedAt: new Date()
        }
      });
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
