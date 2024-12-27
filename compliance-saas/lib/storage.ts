import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requiredScore: number;
  organizationId: string;
}

class Storage {
  private async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readFile<T>(filename: string): Promise<T[]> {
    try {
      const content = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private async writeFile<T>(filename: string, data: T[]) {
    await this.ensureDataDir();
    await fs.writeFile(
      path.join(DATA_DIR, filename),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  }

  async getUsers(): Promise<User[]> {
    return this.readFile<User>('users.json');
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.readFile<Organization>('organizations.json');
  }

  async getFrameworks(): Promise<ComplianceFramework[]> {
    return this.readFile<ComplianceFramework>('frameworks.json');
  }

  async addUser(user: User): Promise<User> {
    const users = await this.getUsers();
    users.push(user);
    await this.writeFile('users.json', users);
    return user;
  }

  async addOrganization(org: Organization): Promise<Organization> {
    const orgs = await this.getOrganizations();
    orgs.push(org);
    await this.writeFile('organizations.json', orgs);
    return org;
  }

  async addFramework(framework: ComplianceFramework): Promise<ComplianceFramework> {
    const frameworks = await this.getFrameworks();
    frameworks.push(framework);
    await this.writeFile('frameworks.json', frameworks);
    return framework;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    const orgs = await this.getOrganizations();
    return orgs.find(o => o.id === id) || null;
  }
}

export const storage = new Storage();
