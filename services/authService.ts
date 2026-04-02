
import { User } from '../types';

const DB_KEY = 'vh_production_db_users';

// Helper to simulate DB Delay
const dbDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const authService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await dbDelay();
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found.");
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return users[index];
  },

  register: async (userData: Partial<User>): Promise<User> => {
    await dbDelay();
    const users = authService.getUsers();
    
    if (userData.email && users.find(u => u.email === userData.email)) {
      throw new Error("Credentials already registered in Haven database.");
    }

    const newUser: User = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: userData.name || 'Anonymous Curator',
      email: userData.email || `user_${Math.random().toString(36).substring(7)}@haven.com`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email || Math.random()}`,
      password: userData.password,
      phone: userData.phone,
      role: userData.role || 'user',
      isPremium: false,
      company: userData.company,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save user to DB:", e);
      throw new Error("Local storage quota exceeded. Could not register user.");
    }
    return newUser;
  },

  login: async (email: string, password?: string): Promise<User> => {
    await dbDelay();
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid access credentials for Haven Protocol.");
    }

    user.lastLogin = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return user;
  },

  // Fix: Added phoneAuth method to handle phone-based authentication as required by LoginPage.tsx
  phoneAuth: async (phone: string): Promise<User> => {
    await dbDelay();
    const users = authService.getUsers();
    let user = users.find(u => u.phone === phone);

    if (!user) {
      // Register a new user if the phone number doesn't exist
      return authService.register({
        name: 'Mobile Curator',
        phone: phone,
        role: 'user'
      });
    }

    user.lastLogin = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return user;
  },

  socialAuth: async (provider: string): Promise<User> => {
    await dbDelay();
    const users = authService.getUsers();
    const mockEmail = `${provider}_curator@gmail.com`;
    let user = users.find(u => u.email === mockEmail);

    if (!user) {
      return authService.register({
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Curator`,
        email: mockEmail,
        role: 'user'
      });
    }

    user.lastLogin = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return user;
  }
};
