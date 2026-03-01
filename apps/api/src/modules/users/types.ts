export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export type UserResponseDTO = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
};