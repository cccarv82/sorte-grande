# Sorte Grande - Test Suite

## 🧪 Testing Architecture

Production-ready E2E test framework using **Playwright** with fixture-based architecture and auto-cleanup patterns.

### Directory Structure

```
tests/
├── e2e/                    # End-to-end test specs
│   └── example.spec.ts     # Sample tests demonstrating patterns
├── support/
│   ├── fixtures/           # Composable test fixtures
│   │   ├── index.ts        # Main fixture exports
│   │   └── factories/      # Data factory patterns
│   │       └── user-factory.ts
│   └── helpers/            # Test utilities (future)
└── README.md               # This file
```

### Architecture Patterns

**Fixture Composition** (`mergeTests` pattern)
- Composable fixtures with dependency injection
- Automatic resource cleanup after tests
- Type-safe fixture usage

**Data Factories** (Faker integration)
- Generate realistic test data
- Consistent test user creation
- Automatic cleanup of created resources

**Selector Strategy**
- Prefer `data-testid` attributes for stable selectors
- Avoid coupling tests to implementation details
- Use semantic locators when appropriate

### 🚀 Quick Start

#### Prerequisites
- Node.js 20.11+ (see `.nvmrc`)
- Dependencies installed (`npm install`)

#### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run with debugging
npm run test:e2e:debug

# Generate HTML report
npx playwright show-report test-results/html
```

#### Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Configure test URLs in `.env.local`

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Run tests in another terminal

### 📝 Writing Tests

#### Basic Test Structure

```typescript
import { test, expect } from '@/tests/support/fixtures';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Sorte Grande/);
});
```

#### Using Fixtures

```typescript
test('should create user', async ({ page, userFactory }) => {
  const user = await userFactory.create({
    email: 'test@example.com',
    name: 'Test User'
  });
  
  // Test with user...
  // Automatic cleanup happens after test
});
```

#### Selector Best Practices

```typescript
// ✅ Good: Use data-testid
await page.getByTestId('login-button').click();

// ✅ Good: Use semantic roles
await page.getByRole('button', { name: 'Login' }).click();

// ❌ Avoid: CSS classes (implementation coupling)
await page.locator('.btn-primary').click();
```

### ⚙️ Configuration

**Timeouts** (Standardized)
- Test timeout: 60s
- Action timeout: 15s
- Navigation timeout: 30s
- Assertion timeout: 10s

**Browsers**
- Default: Chromium
- Optional: Firefox, WebKit (uncomment in `playwright.config.ts`)

**Artifacts** (Failure-only retention)
- Screenshots: `test-results/`
- Videos: `test-results/`
- Traces: `test-results/`

**Reporters**
- HTML: `test-results/html/`
- JUnit: `test-results/junit.xml`
- Console: List format

### 🔧 CI/CD Integration

The framework is CI-ready:
- Automatic retry on failure (2x in CI, 0x local)
- Parallel execution disabled in CI (1 worker)
- Artifact retention for debugging
- JUnit XML output for CI dashboards

Example GitHub Actions:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-results
    path: test-results/
```

### 📚 Knowledge Base References

- `testarch/knowledge/fixture-architecture.md` - Composable fixture patterns
- `testarch/knowledge/data-factories.md` - Factory pattern with Faker
- `testarch/knowledge/playwright-config.md` - Environment configuration
- `testarch/knowledge/network-first.md` - Network testing patterns
- `testarch/knowledge/test-quality.md` - Quality standards

### 🐛 Debugging

**UI Mode** (Recommended)
```bash
npm run test:e2e:ui
```
- Time-travel debugging
- Watch mode
- Visual test runner

**Debug Mode**
```bash
npm run test:e2e:debug
```
- Playwright Inspector
- Step through tests
- Inspect locators

**Headed Mode**
```bash
npx playwright test --headed
```

**Specific Test**
```bash
npx playwright test tests/e2e/example.spec.ts
```

### 📊 Test Quality Standards

1. **Isolation**: Each test independent, no shared state
2. **Clarity**: Descriptive test names, clear assertions
3. **Speed**: Optimize for fast feedback (<60s per test)
4. **Reliability**: Stable selectors, proper waits
5. **Cleanup**: Auto-delete created resources

### 🚧 Future Enhancements

- [ ] Visual regression testing
- [ ] API mocking with MSW
- [ ] Performance budgets
- [ ] Accessibility testing (axe-core)
- [ ] Test data seeding scripts

---

**Framework Version**: Playwright 1.50+  
**Last Updated**: 2025-01-30  
**Maintained by**: Sorte Grande Development Team
