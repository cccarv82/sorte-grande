import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * User Factory for Sorte Grande
 * 
 * Generates realistic test users with automatic cleanup.
 * Uses @faker-js/faker for randomized data generation.
 * 
 * Pattern: Track created resources, delete in cleanup phase
 * 
 * Knowledge Base References:
 * - data-factories.md: Factory pattern with Faker integration
 * - fixture-architecture.md: Auto-cleanup tracking pattern
 */

export interface User {
  id?: string;
  email: string;
  name?: string;
  createdAt?: Date;
}

export interface UserFactoryOptions {
  email?: string;
  name?: string;
}

export function userFactory(page: Page) {
  const createdUsers: string[] = [];

  return {
    /**
     * Create a new test user with optional overrides
     */
    create: async (options: UserFactoryOptions = {}): Promise<User> => {
      const user: User = {
        email: options.email || faker.internet.email(),
        name: options.name || faker.person.fullName(),
      };

      // TODO: Replace with actual API call when authentication is implemented
      // Example pattern:
      // const response = await page.request.post('/api/users', { data: user });
      // const createdUser = await response.json();
      // createdUsers.push(createdUser.id);
      // return createdUser;

      // Temporary mock for demonstration
      const mockId = faker.string.uuid();
      createdUsers.push(mockId);
      
      return {
        ...user,
        id: mockId,
        createdAt: new Date(),
      };
    },

    /**
     * Create multiple test users
     */
    createMany: async function(count: number, options: UserFactoryOptions = {}): Promise<User[]> {
      const users: User[] = [];
      for (let i = 0; i < count; i++) {
        users.push(await this.create(options));
      }
      return users;
    },

    /**
     * Auto-cleanup: Delete all users created during test
     * Called automatically by fixture teardown
     */
    cleanup: async (): Promise<void> => {
      // TODO: Replace with actual API cleanup when authentication is implemented
      // Example pattern:
      // for (const userId of createdUsers) {
      //   await page.request.delete(`/api/users/${userId}`);
      // }
      
      createdUsers.length = 0;
    },
  };
}
