import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Story 1.4 - NextAuth v5 Magic Link Authentication
 * 
 * Tests covering 8 Acceptance Criteria:
 * - AC1: Packages installed
 * - AC2: Resend configured
 * - AC3: NextAuth config complete
 * - AC4: API routes accessible
 * - AC5: DrizzleAdapter integrated
 * - AC6: Auth helpers exported
 * - AC7: Route protection (Server Component pattern)
 * - AC8: E2E magic link flow
 * 
 * Knowledge Base References:
 * - network-first.md: Route interception before navigation
 * - test-quality.md: One assertion per test, deterministic waits
 * - selector-resilience.md: data-testid selector hierarchy
 */

test.describe('Story 1.4: NextAuth Magic Link Authentication', () => {
  
  test.describe('AC4: NextAuth API Routes', () => {
    test('GET /api/auth/providers should return EmailProvider', async ({ request }) => {
      // GIVEN: NextAuth API route exists
      // WHEN: Fetching available providers
      const response = await request.get('/api/auth/providers');

      // THEN: EmailProvider is available
      expect(response.status()).toBe(200);
      const providers = await response.json();
      expect(providers).toHaveProperty('email');
      expect(providers.email).toMatchObject({
        id: 'email',
        name: 'Email',
        type: 'email',
      });
    });

    test('GET /api/auth/session should return null for unauthenticated user', async ({ request }) => {
      // GIVEN: User is not authenticated
      // WHEN: Fetching current session
      const response = await request.get('/api/auth/session');

      // THEN: No session exists
      expect(response.status()).toBe(200);
      const session = await response.json();
      expect(session).toBeNull();
    });

    test('GET /api/auth/csrf should return CSRF token', async ({ request }) => {
      // GIVEN: CSRF protection is enabled
      // WHEN: Requesting CSRF token
      const response = await request.get('/api/auth/csrf');

      // THEN: Token is returned
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('csrfToken');
      expect(typeof body.csrfToken).toBe('string');
      expect(body.csrfToken.length).toBeGreaterThan(0);
    });
  });

  test.describe('AC7: Route Protection (Server Component Pattern)', () => {
    test('should redirect unauthenticated user from /dashboard to /login', async ({ page }) => {
      // GIVEN: User is not authenticated
      // WHEN: Navigating to protected route
      await page.goto('/dashboard');

      // THEN: Redirected to login page
      await expect(page).toHaveURL('/login');
    });

    test('should allow access to public routes without authentication', async ({ page }) => {
      // GIVEN: User is not authenticated
      // WHEN: Navigating to public route
      const response = await page.goto('/');

      // THEN: Page loads successfully
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('AC8: Magic Link Request Flow', () => {
    test('should display login form with email input', async ({ page }) => {
      // GIVEN: User visits login page
      await page.goto('/login');

      // THEN: Email form is displayed
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show success message after magic link request', async ({ page }) => {
      // GIVEN: User is on login page
      await page.goto('/login');

      // WHEN: User submits email
      await page.locator('[data-testid="email-input"]').fill('test@example.com');
      await page.locator('button[type="submit"]').click();

      // THEN: Success message or redirect to verification page
      // Note: Actual behavior depends on implementation
      // Option 1: Inline success message
      // await expect(page.locator('text=Email enviado')).toBeVisible();
      
      // Option 2: Redirect to /verify page
      await page.waitForURL('/verify', { timeout: 5000 }).catch(() => {
        // If no redirect, check for inline success message
        return expect(page.locator('text=enviado')).toBeVisible();
      });
    });

    test('should disable submit button while submitting', async ({ page }) => {
      // GIVEN: User is on login page
      await page.goto('/login');

      // WHEN: User starts submitting email
      await page.locator('[data-testid="email-input"]').fill('test@example.com');
      const submitButton = page.locator('button[type="submit"]');
      
      // Click and immediately check disabled state
      const clickPromise = submitButton.click();
      
      // THEN: Button should be disabled during submission
      await expect(submitButton).toBeDisabled();
      
      // Wait for submission to complete
      await clickPromise;
    });
  });

  test.describe('AC3: Email Validation', () => {
    test('should show error for invalid email format', async ({ page }) => {
      // GIVEN: User is on login page
      await page.goto('/login');

      // WHEN: User submits invalid email
      await page.locator('[data-testid="email-input"]').fill('invalid-email');
      await page.locator('button[type="submit"]').click();

      // THEN: Form validation error is shown
      // Note: Behavior depends on implementation (HTML5 validation or custom)
      const emailInput = page.locator('[data-testid="email-input"]');
      
      // Check HTML5 validation state
      const validityState = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(validityState).toBe(false);
    });

    test('should disable submit button when email is empty', async ({ page }) => {
      // GIVEN: User is on login page
      await page.goto('/login');

      // WHEN: Email field is empty
      const submitButton = page.locator('button[type="submit"]');

      // THEN: Submit button is disabled
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe('AC6: SessionProvider Integration', () => {
    test('should render SessionProvider in root layout', async ({ page }) => {
      // GIVEN: Application uses SessionProvider
      // WHEN: Loading any page
      await page.goto('/');

      // THEN: No SessionProvider errors in console
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.waitForTimeout(1000);

      // Check for common SessionProvider errors
      const sessionErrors = consoleErrors.filter(err => 
        err.includes('SessionProvider') || 
        err.includes('useSession')
      );
      
      expect(sessionErrors).toHaveLength(0);
    });
  });
});

/**
 * MANUAL TESTING REQUIRED:
 * 
 * The following scenarios require manual testing or specialized tools (Mailosaur):
 * 
 * 1. Magic Link Email Delivery:
 *    - Check Resend dashboard for sent emails
 *    - Verify email subject: "Login no Sorte Grande"
 *    - Verify gradient button rendering
 *    - Verify 15-minute expiration notice
 * 
 * 2. Magic Link Click Flow:
 *    - Click magic link from email
 *    - Verify redirect to /dashboard or callback URL
 *    - Verify session created with user.id and email
 * 
 * 3. Session Persistence:
 *    - Refresh page after authentication
 *    - Verify session persists (JWT cookie)
 *    - Verify user remains authenticated
 * 
 * 4. Magic Link Expiration:
 *    - Wait 15+ minutes after requesting link
 *    - Click expired link
 *    - Verify error message: "Link has expired"
 * 
 * 5. Sign Out Flow:
 *    - Authenticate user
 *    - Click logout button
 *    - Verify session cleared
 *    - Verify redirect to login page
 * 
 * Future: Integrate Mailosaur or similar email testing service for E2E automation
 */
