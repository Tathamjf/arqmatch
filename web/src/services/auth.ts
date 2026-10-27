import type { User } from '../types/domain';
import { storage } from './storage';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const toHex = (bytes: ArrayBuffer): string =>
  Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');

const createSalt = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toHex(bytes.buffer);
};

const hashPassword = async (password: string, salt: string): Promise<string> => {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest('SHA-256', data));
};

export const authService = {
  async register(fullName: string, email: string, password: string): Promise<User> {
    const normalizedEmail = normalizeEmail(email);
    const users = storage.getUsers();

    if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const passwordSalt = createSalt();
    const user: User = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password, passwordSalt),
      passwordSalt,
      createdAt: new Date().toISOString(),
    };

    storage.saveUsers([...users, user]);
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    const user = storage
      .getUsers()
      .find((candidate) => normalizeEmail(candidate.email) === normalizeEmail(email));

    if (!user || (await hashPassword(password, user.passwordSalt)) !== user.passwordHash) {
      throw new Error('E-mail ou senha inválidos.');
    }

    storage.saveSession({ userId: user.id });
    return user;
  },

  getCurrentUser(): User | null {
    const session = storage.getSession();
    if (!session) {
      return null;
    }

    return storage.getUsers().find((user) => user.id === session.userId) ?? null;
  },

  logout(): void {
    storage.clearSession();
  },
};
