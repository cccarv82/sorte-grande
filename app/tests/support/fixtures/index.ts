import { test as base } from '@playwright/test';
import { userFactory } from './factories/user-factory';

/**
 * Composable Fixture Architecture for Sorte Grande
 * 
 * Pattern: mergeTests composition with auto-cleanup
 * 
 * Usage Example:
 * ```typescript
 * import { test, expect } from '@/tests/support/fixtures';
 * 
 * test('create user and login', async ({ page, userFactory }) => {
 *   const user = await userFactory.create({ email: 'test@example.com' });
 *   await page.goto('/login');
 *   await page.getByTestId('email-input').fill(user.email);
 *   await page.getByTestId('login-button').click();
 *   await expect(page).toHaveURL('/dashboard');
 *   // userFactory auto-cleanup will delete user after test
 * });
 * ```
 * 
 * Knowledge Base Reference: fixture-architecture.md
 */

type CustomFixtures = {
  userFactory: ReturnType<typeof userFactory>;
};

export const test = base.extend<CustomFixtures>({
  userFactory: async ({ page }, use) => {
    const factory = userFactory(page);
    await use(factory);
    // Auto-cleanup: delete all created resources
    await factory.cleanup();
  },
});

export { expect } from '@playwright/test';
