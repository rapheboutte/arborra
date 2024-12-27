import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    console.log('[init] Starting initialization check');

    // Check if we have any existing data
    const [users, organizations, frameworks] = await Promise.all([
      storage.getUsers(),
      storage.getOrganizations(),
      storage.getFrameworks()
    ]);

    if (users.length === 0 || organizations.length === 0 || frameworks.length === 0) {
      console.log('[init] No data found, initializing default data');

      // Create default organization
      const defaultOrg = {
        id: uuidv4(),
        name: 'Default Organization'
      };
      await storage.addOrganization(defaultOrg);

      // Create admin user
      const adminUser = {
        id: uuidv4(),
        email: 'admin@arborra.com',
        name: 'Admin User',
        role: 'ADMIN',
        organizationId: defaultOrg.id
      };
      await storage.addUser(adminUser);

      // Create default frameworks
      const defaultFrameworks = [
        {
          id: uuidv4(),
          name: 'SOC 2',
          description: 'Service Organization Control 2',
          requiredScore: 80,
          organizationId: defaultOrg.id
        },
        {
          id: uuidv4(),
          name: 'HIPAA',
          description: 'Health Insurance Portability and Accountability Act',
          requiredScore: 90,
          organizationId: defaultOrg.id
        },
        {
          id: uuidv4(),
          name: 'ISO 27001',
          description: 'Information Security Management System Standard',
          requiredScore: 85,
          organizationId: defaultOrg.id
        },
        {
          id: uuidv4(),
          name: 'GDPR',
          description: 'General Data Protection Regulation',
          requiredScore: 85,
          organizationId: defaultOrg.id
        }
      ];

      for (const framework of defaultFrameworks) {
        await storage.addFramework(framework);
      }

      console.log('[init] Default data created successfully');

      return NextResponse.json({
        success: true,
        message: 'System initialized successfully',
        data: {
          organization: defaultOrg,
          user: adminUser,
          initialized: true
        }
      });
    }

    // System is already initialized
    const adminUser = await storage.getUserByEmail('admin@arborra.com');
    if (!adminUser) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'System already initialized',
      data: {
        user: adminUser,
        initialized: true
      }
    });

  } catch (error) {
    console.error('[init] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      details: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
}
