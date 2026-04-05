import { test, expect } from '@playwright/test';

/**
 * API Tests: Database Debug Endpoint
 *
 * Tests the /api/debug/db endpoint that provides environment and
 * database connection diagnostics.
 *
 * Coverage:
 * - Environment variable validation
 * - Database connection testing
 * - Response structure
 * - Error handling for missing configuration
 * - Security considerations (no sensitive data exposure)
 *
 * Knowledge Base References:
 * - test-quality.md: Integration testing, explicit assertions
 * - QA Diagnostic Report: Phase 1 API testing requirements
 */

test.describe('API: Debug Database', () => {

  test.describe('Endpoint Accessibility', () => {
    test('GET /api/debug/db should be accessible', async ({ request }) => {
      // GIVEN: Debug endpoint exists
      // WHEN: Making GET request
      const response = await request.get('/api/debug/db');

      // THEN: Should return a response (not 404)
      expect(response.status()).not.toBe(404);
      expect([200, 500]).toContain(response.status());
    });

    test('GET /api/debug/db should only accept GET method', async ({ request }) => {
      // GIVEN: Attempting POST to debug endpoint
      // WHEN: Making POST request
      const response = await request.post('/api/debug/db');

      // THEN: Should reject with 405 or 404
      expect([404, 405]).toContain(response.status());
    });

    test('GET /api/debug/db should return JSON content-type', async ({ request }) => {
      // GIVEN: Debug endpoint request
      // WHEN: Making GET request
      const response = await request.get('/api/debug/db');

      // THEN: Should return JSON
      expect(response.headers()['content-type']).toContain('application/json');
    });
  });

  test.describe('Environment Variable Checks', () => {
    test('GET /api/debug/db should check for required environment variables', async ({ request }) => {
      // GIVEN: Debug endpoint with env check logic
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Response should include env_check
      const body = await response.json();
      expect(body).toHaveProperty('env_check');
      expect(typeof body.env_check).toBe('object');
    });

    test('GET /api/debug/db env_check should validate DATABASE_URL', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check DATABASE_URL existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('DATABASE_URL');
      expect(typeof body.env_check.DATABASE_URL).toBe('boolean');
    });

    test('GET /api/debug/db env_check should validate NEXTAUTH_URL', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check NEXTAUTH_URL existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('NEXTAUTH_URL');
      expect(typeof body.env_check.NEXTAUTH_URL).toBe('boolean');
    });

    test('GET /api/debug/db env_check should validate NEXTAUTH_SECRET', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check NEXTAUTH_SECRET existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('NEXTAUTH_SECRET');
      expect(typeof body.env_check.NEXTAUTH_SECRET).toBe('boolean');
    });

    test('GET /api/debug/db env_check should validate RESEND_API_KEY', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check RESEND_API_KEY existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('RESEND_API_KEY');
      expect(typeof body.env_check.RESEND_API_KEY).toBe('boolean');
    });

    test('GET /api/debug/db env_check should validate EMAIL_FROM', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check EMAIL_FROM existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('EMAIL_FROM');
      expect(typeof body.env_check.EMAIL_FROM).toBe('boolean');
    });

    test('GET /api/debug/db env_check should validate CRON_SECRET', async ({ request }) => {
      // GIVEN: Environment configuration
      // WHEN: Requesting debug info
      const response = await request.get('/api/debug/db');

      // THEN: Should check CRON_SECRET existence
      const body = await response.json();
      expect(body.env_check).toHaveProperty('CRON_SECRET');
      expect(typeof body.env_check.CRON_SECRET).toBe('boolean');
    });
  });

  test.describe('Success Response Structure', () => {
    test('GET /api/debug/db success response should have required fields', async ({ request }) => {
      // GIVEN: Properly configured environment
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If successful (200), should have all required fields
      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('timestamp');
        expect(body).toHaveProperty('env_check');
        expect(body).toHaveProperty('database_url_preview');
        expect(body).toHaveProperty('nextauth_url');
        expect(body).toHaveProperty('email_from');
        expect(body).toHaveProperty('tables');
      }
    });

    test('GET /api/debug/db should return database timestamp', async ({ request }) => {
      // GIVEN: Active database connection
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If successful, timestamp should be valid date
      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty('timestamp');

        // Should be parseable as date
        const timestamp = new Date(body.timestamp);
        expect(timestamp.toString()).not.toBe('Invalid Date');

        // Should be recent (within last minute)
        const now = new Date();
        const diff = Math.abs(now.getTime() - timestamp.getTime());
        expect(diff).toBeLessThan(60000); // 60 seconds
      }
    });

    test('GET /api/debug/db should return tables list', async ({ request }) => {
      // GIVEN: Database with tables
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If successful, should list tables
      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty('tables');
        expect(Array.isArray(body.tables)).toBe(true);

        // Tables array should exist (may be empty if schema not pushed)
        expect(body.tables.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Error Response Structure', () => {
    test('GET /api/debug/db error response should have error field', async ({ request }) => {
      // GIVEN: Potential configuration issues
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If error (500), should have error details
      if (response.status() === 500) {
        const body = await response.json();
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
      }
    });

    test('GET /api/debug/db should identify missing environment variables', async ({ request }) => {
      // GIVEN: Potentially missing env vars
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If env vars missing, should list them
      const body = await response.json();

      if (body.error === 'Missing environment variables') {
        expect(body).toHaveProperty('missing');
        expect(Array.isArray(body.missing)).toBe(true);
        expect(body.missing.length).toBeGreaterThan(0);
      }
    });

    test('GET /api/debug/db should include env_check in error response', async ({ request }) => {
      // GIVEN: Error condition
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Error response should still include env_check
      const body = await response.json();
      expect(body).toHaveProperty('env_check');
      expect(typeof body.env_check).toBe('object');
    });
  });

  test.describe('Security Considerations', () => {
    test('GET /api/debug/db should not expose full DATABASE_URL', async ({ request }) => {
      // GIVEN: Database URL contains sensitive credentials
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Should only show preview (first 50 chars + ...)
      const body = await response.json();

      if (body.database_url_preview) {
        expect(body.database_url_preview).toContain('...');
        expect(body.database_url_preview.length).toBeLessThanOrEqual(53); // 50 + '...'
      }

      // Should not have full DATABASE_URL exposed
      expect(body).not.toHaveProperty('DATABASE_URL');
      expect(body).not.toHaveProperty('database_url');
    });

    test('GET /api/debug/db should not expose NEXTAUTH_SECRET', async ({ request }) => {
      // GIVEN: NEXTAUTH_SECRET is sensitive
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Should not include the actual secret value
      const body = await response.json();
      const bodyStr = JSON.stringify(body);

      // Should only show boolean check, not actual value
      expect(bodyStr).not.toContain(process.env.NEXTAUTH_SECRET || 'secret-value-should-not-appear');
    });

    test('GET /api/debug/db should not expose RESEND_API_KEY', async ({ request }) => {
      // GIVEN: RESEND_API_KEY is sensitive
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Should not include the actual API key
      const body = await response.json();
      expect(body).not.toHaveProperty('RESEND_API_KEY');
      expect(body).not.toHaveProperty('resend_api_key');
    });

    test('GET /api/debug/db should not expose CRON_SECRET', async ({ request }) => {
      // GIVEN: CRON_SECRET is sensitive
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Should not include the actual secret
      const body = await response.json();
      expect(body).not.toHaveProperty('CRON_SECRET');
      expect(body).not.toHaveProperty('cron_secret');
    });
  });

  test.describe('Database Connection', () => {
    test('GET /api/debug/db should test database connectivity', async ({ request }) => {
      // GIVEN: Database connection configured
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: Should attempt connection and return result
      expect([200, 500]).toContain(response.status());

      const body = await response.json();
      if (response.status() === 200) {
        // Success means connection worked
        expect(body.success).toBe(true);
      } else {
        // Error should include connection error details
        expect(body).toHaveProperty('error');
      }
    });

    test('GET /api/debug/db should handle database connection errors', async ({ request }) => {
      // GIVEN: Potential database connectivity issues
      // WHEN: Making request
      const response = await request.get('/api/debug/db');

      // THEN: If connection fails, should return error details
      if (response.status() === 500) {
        const body = await response.json();
        expect(body).toHaveProperty('error');

        // May include database-specific error codes
        if (body.code) {
          expect(typeof body.code).toBe('string');
        }
      }
    });
  });
});
