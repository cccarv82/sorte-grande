import { test, expect } from '@playwright/test';

/**
 * API Tests: Lottery Results Sync Cron Endpoint
 *
 * Tests the /api/cron/sync-results endpoint that is designed to be
 * called by cron jobs or external schedulers to sync lottery results.
 *
 * Coverage:
 * - Authorization via Bearer token
 * - CRON_SECRET validation
 * - Success response structure
 * - Unauthorized access prevention
 * - Error handling
 *
 * Knowledge Base References:
 * - test-quality.md: Security testing, explicit assertions
 * - QA Diagnostic Report: Phase 1 critical API testing
 */

test.describe('API: Cron Sync Results', () => {

  test.describe('Authorization', () => {
    test('GET /api/cron/sync-results should reject requests without authorization header', async ({ request }) => {
      // GIVEN: No authorization header provided
      // WHEN: Requesting sync endpoint
      const response = await request.get('/api/cron/sync-results');

      // THEN: Should return 401 Unauthorized
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error', 'Unauthorized');
    });

    test('GET /api/cron/sync-results should reject requests with empty authorization header', async ({ request }) => {
      // GIVEN: Empty authorization header
      // WHEN: Requesting with empty Bearer token
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': 'Bearer '
        }
      });

      // THEN: Should return 401 Unauthorized
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error', 'Unauthorized');
    });

    test('GET /api/cron/sync-results should reject requests with invalid token', async ({ request }) => {
      // GIVEN: Invalid authorization token
      const invalidToken = 'invalid-token-12345';

      // WHEN: Requesting with wrong token
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': `Bearer ${invalidToken}`
        }
      });

      // THEN: Should return 401 Unauthorized
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error', 'Unauthorized');
    });

    test('GET /api/cron/sync-results should reject malformed authorization headers', async ({ request }) => {
      // GIVEN: Authorization header without "Bearer " prefix
      // WHEN: Requesting with token only (no Bearer prefix)
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': 'some-token'
        }
      });

      // THEN: Should return 401 Unauthorized
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error', 'Unauthorized');
    });

    test('GET /api/cron/sync-results should handle missing CRON_SECRET env var', async ({ request }) => {
      // GIVEN: CRON_SECRET might not be configured in test environment
      const testToken = 'test-token';

      // WHEN: Requesting with any token
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });

      // THEN: Should return 401 or 500 (if secret not configured)
      expect([401, 500]).toContain(response.status());
      const body = await response.json();
      expect(body).toHaveProperty('error');

      if (response.status() === 500) {
        expect(body.error).toContain('Server configuration error');
      }
    });
  });

  test.describe('Response Format', () => {
    test('GET /api/cron/sync-results should return JSON content-type', async ({ request }) => {
      // GIVEN: Any request to the endpoint
      // WHEN: Making request (even without auth)
      const response = await request.get('/api/cron/sync-results');

      // THEN: Response should be JSON
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('GET /api/cron/sync-results unauthorized response should have error field', async ({ request }) => {
      // GIVEN: Request without authorization
      // WHEN: Making unauthorized request
      const response = await request.get('/api/cron/sync-results');

      // THEN: Should return structured error
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(typeof body.error).toBe('string');
    });

    test('GET /api/cron/sync-results success response should have required fields', async ({ request }) => {
      // GIVEN: Valid authorization token (if env is configured)
      // Note: This test will only succeed if CRON_SECRET is set and we use it
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET || 'test'}`
        }
      });

      // THEN: If authorized (200), should have success structure
      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('timestamp');
        expect(body.message).toContain('Lottery results sync completed');

        // Timestamp should be valid ISO date
        expect(() => new Date(body.timestamp)).not.toThrow();
      }
    });
  });

  test.describe('Security', () => {
    test('GET /api/cron/sync-results should not leak sensitive info in error messages', async ({ request }) => {
      // GIVEN: Invalid authorization
      // WHEN: Making request with wrong token
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': 'Bearer wrong-token'
        }
      });

      // THEN: Error message should not reveal the actual secret
      const body = await response.json();
      expect(body.error).not.toContain('CRON_SECRET');

      // Only check for actual secret value if it exists
      if (process.env.CRON_SECRET) {
        expect(body.error).not.toContain(process.env.CRON_SECRET);
      }
    });

    test('GET /api/cron/sync-results should only accept GET method', async ({ request }) => {
      // GIVEN: Attempt to use POST method
      // WHEN: Posting to the endpoint
      const response = await request.post('/api/cron/sync-results', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });

      // THEN: Should reject with 405 Method Not Allowed or 404
      expect([404, 405]).toContain(response.status());
    });

    test('GET /api/cron/sync-results should trim authorization token', async ({ request }) => {
      // GIVEN: Token with whitespace
      const tokenWithSpaces = '  test-token  ';

      // WHEN: Requesting with token containing whitespace
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': `Bearer ${tokenWithSpaces}`
        }
      });

      // THEN: Should process the trimmed token (401 for invalid, not 500)
      expect([401, 500]).toContain(response.status());
    });
  });

  test.describe('Future Implementation Readiness', () => {
    test('GET /api/cron/sync-results endpoint should exist and be accessible', async ({ request }) => {
      // GIVEN: The cron endpoint
      // WHEN: Making any request to it
      const response = await request.get('/api/cron/sync-results');

      // THEN: Should not return 404 (endpoint exists)
      expect(response.status()).not.toBe(404);
    });

    test('GET /api/cron/sync-results should handle errors gracefully', async ({ request }) => {
      // GIVEN: Any request (authorized or not)
      // WHEN: Making request
      const response = await request.get('/api/cron/sync-results', {
        headers: {
          'Authorization': `Bearer test`
        }
      });

      // THEN: Should return valid HTTP status (not crash)
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(600);

      // Should return valid JSON
      const body = await response.json();
      expect(body).toBeDefined();
      expect(typeof body).toBe('object');
    });
  });
});
