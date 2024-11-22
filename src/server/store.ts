import { Checkout } from './types';
import fs from 'fs/promises';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'data');
const CHECKOUTS_FILE = path.join(STORAGE_PATH, 'checkouts.json');

class CheckoutStore {
  private checkouts: Map<string, Checkout> = new Map();

  constructor() {
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.mkdir(STORAGE_PATH, { recursive: true });
      try {
        const data = await fs.readFile(CHECKOUTS_FILE, 'utf-8');
        const checkouts = JSON.parse(data);
        this.checkouts = new Map(Object.entries(checkouts));
      } catch (error) {
        // File doesn't exist yet, start with empty store
        await this.persist();
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  private async persist(): Promise<void> {
    try {
      const data = Object.fromEntries(this.checkouts);
      await fs.writeFile(CHECKOUTS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to persist checkouts:', error);
    }
  }

  async create(checkout: Omit<Checkout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Checkout> {
    const id = Math.random().toString(36).substring(2, 15);
    const now = new Date();
    
    const newCheckout: Checkout = {
      ...checkout,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
    };

    this.checkouts.set(id, newCheckout);
    await this.persist();
    return newCheckout;
  }

  async get(id: string): Promise<Checkout | undefined> {
    return this.checkouts.get(id);
  }

  async update(id: string, updates: Partial<Checkout>): Promise<Checkout | undefined> {
    const checkout = this.checkouts.get(id);
    if (!checkout) return undefined;

    const updatedCheckout: Checkout = {
      ...checkout,
      ...updates,
      updatedAt: new Date(),
    };

    this.checkouts.set(id, updatedCheckout);
    await this.persist();
    return updatedCheckout;
  }

  async list(): Promise<Checkout[]> {
    return Array.from(this.checkouts.values());
  }
}