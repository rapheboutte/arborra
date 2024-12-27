import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
};

export const Permissions = {
  // Organization management
  MANAGE_ORGANIZATION: "manage_organization",
  MANAGE_USERS: "manage_users",
  MANAGE_SETTINGS: "manage_settings",
  
  // Task management
  VIEW_TASKS: "view_tasks",
  CREATE_TASKS: "create_tasks",
  EDIT_TASKS: "edit_tasks",
  DELETE_TASKS: "delete_tasks",
  
  // Document management
  VIEW_DOCUMENTS: "view_documents",
  UPLOAD_DOCUMENTS: "upload_documents",
  DELETE_DOCUMENTS: "delete_documents",
  
  // Reports
  VIEW_REPORTS: "view_reports",
  GENERATE_REPORTS: "generate_reports"
} as const;

export type Permission = keyof typeof Permissions;

export const RolePermissions: Record<string, Permission[]> = {
  admin: Object.values(Permissions) as Permission[],
  user: [
    Permissions.VIEW_TASKS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_REPORTS,
    Permissions.EDIT_TASKS
  ]
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  return RolePermissions[userRole]?.includes(permission) ?? false;
}

export function validatePermissions(userRole: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}
