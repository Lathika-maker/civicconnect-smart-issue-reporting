
interface User {
  email: string;
  passwordHash: string; // In a real app, we'd hash these
  name: string;
}

interface Authority {
  id: string;
  passwordHash: string;
}

class MockDatabase {
  private USERS_KEY = 'civic_connect_users';
  private AUTHORITIES_KEY = 'civic_connect_authorities';

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        { email: 'lathika292006@gmail.com', passwordHash: 'Password123!', name: 'Lathika' },
        { email: 'user@example.com', passwordHash: 'User123!', name: 'Example User' }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem(this.AUTHORITIES_KEY)) {
      const defaultAuthorities: Authority[] = [
        { id: 'CIVIC_ADMIN_2026', passwordHash: 'Admin123!' },
        { id: 'CIVIC_ADMIN_1001', passwordHash: 'Admin1001!' }
      ];
      localStorage.setItem(this.AUTHORITIES_KEY, JSON.stringify(defaultAuthorities));
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  getAuthorities(): Authority[] {
    return JSON.parse(localStorage.getItem(this.AUTHORITIES_KEY) || '[]');
  }

  addUser(user: User): boolean {
    const users = this.getUsers();
    if (users.some(u => u.email === user.email)) return false;
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  addAuthority(authority: Authority): boolean {
    const authorities = this.getAuthorities();
    if (authorities.some(a => a.id === authority.id)) return false;
    authorities.push(authority);
    localStorage.setItem(this.AUTHORITIES_KEY, JSON.stringify(authorities));
    return true;
  }

  authenticateUser(email: string, passwordHash: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email && u.passwordHash === passwordHash) || null;
  }

  authenticateAuthority(id: string, passwordHash: string): Authority | null {
    const authorities = this.getAuthorities();
    return authorities.find(a => a.id === id && a.passwordHash === passwordHash) || null;
  }
}

export const db = new MockDatabase();
