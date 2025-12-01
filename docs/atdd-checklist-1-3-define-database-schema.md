# ATDD Checklist - Story 1.3: Define Database Schema with Drizzle ORM

**Generated:** 2025-12-01  
**Story:** 1.3 - Define Database Schema with Drizzle ORM  
**Epic:** Epic 1 - Foundation & Project Setup  
**Status:** ✅ GREEN PHASE (All tests passing)

---

## Story Summary

Implement complete database schema with Drizzle ORM including 4 tables (users, suggestions, lottery_results, prizes) with proper relationships, indexes, and type safety. The schema must be NextAuth v5 compatible and LGPD-compliant with CASCADE delete for data privacy.

---

## Acceptance Criteria Breakdown

### AC1: Drizzle ORM Installed and Configured
- ✅ **Test Coverage:** 3 acceptance tests
- ✅ **Validates:** Package installation, configuration file, database connection
- ✅ **Status:** PASSING

### AC2: Users Table Defined (NextAuth Compatible)
- ✅ **Test Coverage:** 3 acceptance tests
- ✅ **Validates:** Table structure, unique constraint on email, email index
- ✅ **Status:** PASSING

### AC3: Suggestions Table Defined
- ✅ **Test Coverage:** 4 acceptance tests
- ✅ **Validates:** 12 fields, CASCADE delete FK, userId/status indexes, status default value
- ✅ **Status:** PASSING

### AC4: Lottery Results Table Defined
- ✅ **Test Coverage:** 3 acceptance tests
- ✅ **Validates:** 7 fields with array type, unique constraint on (lottery, contestNumber), lottery/drawDate indexes
- ✅ **Status:** PASSING

### AC5: Prizes Table Defined
- ✅ **Test Coverage:** 3 acceptance tests
- ✅ **Validates:** 9 fields with array type, CASCADE delete FK, suggestionId index
- ✅ **Status:** PASSING

### AC6: TypeScript Types Exported
- ✅ **Test Coverage:** 2 acceptance tests
- ✅ **Validates:** Type exports in types/database.ts, schema exports from lib/db
- ✅ **Status:** PASSING

### AC7: Migrations Generated and Applied
- ✅ **Test Coverage:** 3 acceptance tests
- ✅ **Validates:** Migration file exists with all tables, all 4 tables in database, correct constraint counts
- ✅ **Status:** PASSING

### AC8: Schema Validation and Documentation
- ✅ **Test Coverage:** 2 acceptance tests
- ✅ **Validates:** Validation script logic, README documentation
- ✅ **Status:** PASSING

---

## Test Files Created

### Acceptance Tests (E2E Level)
**File:** `tests/acceptance/database/schema.spec.ts`  
**Lines:** 600+ lines  
**Test Count:** 23 tests organized in 8 test suites (one per AC)

**Test Structure:**
```typescript
test.describe('Story 1.3: Database Schema - Acceptance Tests', () => {
  test.describe('AC1: Drizzle ORM Installed and Configured', () => {
    test('GIVEN Drizzle is installed WHEN checking package.json...', async () => {
      // Given-When-Then format
    });
    // 2 more tests for AC1
  });
  // 7 more test suites for AC2-AC8
});
```

**Test Patterns Applied:**
- ✅ Given-When-Then format for readability
- ✅ Direct database queries for schema validation
- ✅ File system checks for configuration files
- ✅ TypeScript import validation
- ✅ Constraint and index verification
- ✅ Auto-cleanup with `test.afterAll()`

---

## Test Execution Results

### Initial Run: GREEN PHASE ✅

```bash
Running 23 tests using 6 workers
 23 passed (1.6s)
```

**All acceptance criteria validated:**
- ✅ AC1: 3 tests passing (Drizzle installed, config valid, connection works)
- ✅ AC2: 3 tests passing (Users table with unique email, email index)
- ✅ AC3: 4 tests passing (Suggestions table with FK, indexes, default status)
- ✅ AC4: 3 tests passing (Lottery Results with unique constraint, indexes)
- ✅ AC5: 3 tests passing (Prizes table with FK, index)
- ✅ AC6: 2 tests passing (Types exported correctly)
- ✅ AC7: 3 tests passing (Migration generated, applied, constraints verified)
- ✅ AC8: 2 tests passing (Validation script works, README documented)

**Performance:**
- Average test execution: ~70ms per test
- Total suite execution: 1.6 seconds
- Parallelization: 6 workers

---

## Data Infrastructure

### Database Connection Fixture
**File:** `lib/db/index.ts` (existing from Story 1.2)  
**Pattern:** Singleton connection pool with auto-cleanup

```typescript
import { getDbConnection, closeDbConnection } from '../../../lib/db';

test.afterAll(async () => {
  await closeDbConnection(); // Cleanup after all tests
});
```

**No data factories needed** - This story tests schema structure only, no test data creation required.

---

## Required data-testid Attributes

**N/A for this story** - Database schema story does not involve UI components.

---

## Mock Requirements

**N/A for this story** - Tests connect to real Neon database (development branch).

---

## Knowledge Base Patterns Applied

### 1. Test Quality Principles
**Source:** `test-quality.md` (658 lines, 5 examples)

- ✅ **Deterministic tests:** All tests use database queries, no random data
- ✅ **Isolated with cleanup:** `closeDbConnection()` in `afterAll` hook
- ✅ **Explicit assertions:** Each test verifies specific schema properties
- ✅ **Length limits:** Each test focused on single aspect of AC

### 2. Fixture Architecture
**Source:** `fixture-architecture.md` (406 lines, 5 examples)

- ✅ **Pure function pattern:** Database connection helper is reusable
- ✅ **Auto-cleanup:** Connection pool closed after test suite

### 3. Given-When-Then Format
**Source:** `test-quality.md`

All 23 tests follow strict Given-When-Then format:
```typescript
// GIVEN: Setup context
const pool = getDbConnection();

// WHEN: Execute action
const result = await pool.query('SELECT...');

// THEN: Verify outcome
expect(result.rows).toHaveLength(4);
```

---

## Implementation Checklist

### ✅ Epic 1 - Story 1.3 Implementation (COMPLETE)

#### Test Suite 1: AC1 - Drizzle Installation
- [x] Install drizzle-orm as runtime dependency
- [x] Install drizzle-kit as dev dependency
- [x] Create drizzle.config.ts with PostgreSQL dialect
- [x] Configure DATABASE_URL from environment
- [x] ✅ **3 tests passing** (package.json verified, config loaded, connection works)

#### Test Suite 2: AC2 - Users Table
- [x] Define users table with pgTable
- [x] Add id (text UUID), email (unique), name, emailVerified, image, createdAt
- [x] Add unique constraint on email
- [x] Create idx_users_email index
- [x] ✅ **3 tests passing** (table structure, unique constraint, index)

#### Test Suite 3: AC3 - Suggestions Table
- [x] Define suggestions table with 12 fields
- [x] Add userId FK to users with CASCADE delete
- [x] Add idx_suggestions_user_id index
- [x] Add idx_suggestions_status index
- [x] Set status default to 'pending'
- [x] ✅ **4 tests passing** (12 fields, FK, indexes, default)

#### Test Suite 4: AC4 - Lottery Results Table
- [x] Define lottery_results table with 7 fields
- [x] Use integer array for draw_numbers
- [x] Add unique constraint on (lottery, contest_number)
- [x] Create idx_lottery_results_lottery index
- [x] Create idx_lottery_results_draw_date index
- [x] ✅ **3 tests passing** (7 fields, unique constraint, indexes)

#### Test Suite 5: AC5 - Prizes Table
- [x] Define prizes table with 9 fields
- [x] Add suggestionId FK to suggestions with CASCADE delete
- [x] Use integer array for matched_numbers
- [x] Create idx_prizes_suggestion_id index
- [x] ✅ **3 tests passing** (9 fields, FK, index)

#### Test Suite 6: AC6 - TypeScript Types
- [x] Create types/database.ts with Lottery, SuggestionStatus, PrizeTier types
- [x] Add Game and PrizeTiers interfaces
- [x] Export schema from lib/db/index.ts
- [x] ✅ **2 tests passing** (type file exists, schema exported)

#### Test Suite 7: AC7 - Migrations
- [x] Generate migration with drizzle-kit generate
- [x] Apply migration to Neon with drizzle-kit push
- [x] Verify all 4 tables created
- [x] Verify all constraints (4 PKs, 2 FKs, 2 unique)
- [x] ✅ **3 tests passing** (migration file, tables, constraints)

#### Test Suite 8: AC8 - Validation & Docs
- [x] Create validate-schema.ts script
- [x] Add db:validate npm script
- [x] Update README with Database Schema section
- [x] Document Drizzle commands and examples
- [x] ✅ **2 tests passing** (validation script, README)

---

## Red-Green-Refactor Workflow

### ✅ RED Phase (N/A - Post-Implementation Tests)

**Note:** This story was implemented BEFORE ATDD tests were created. Normally, tests would be written first (RED phase), then implementation (GREEN phase), then refactoring (REFACTOR phase).

For future stories, follow this workflow:
1. Write failing tests first (RED)
2. Implement minimal code to pass tests (GREEN)
3. Improve code quality with confidence (REFACTOR)

### ✅ GREEN Phase (COMPLETE)

- ✅ **All 23 tests passing**
- ✅ **All 8 acceptance criteria validated**
- ✅ **Database schema fully functional**
- ✅ **TypeScript compilation: 0 errors**
- ✅ **Migration applied to Neon successfully**

### ✅ REFACTOR Phase (COMPLETE)

**Code quality improvements already applied:**
- ✅ Comprehensive JSDoc comments in schema.ts
- ✅ Type-safe JSONB structures with TypeScript interfaces
- ✅ Proper use of centavos for monetary values
- ✅ CASCADE delete for LGPD compliance
- ✅ Optimized indexes for query performance

**No refactoring needed** - Implementation is production-ready.

---

## Running Tests

### Run All Acceptance Tests
```bash
cd app
npx playwright test tests/acceptance/database/schema.spec.ts --reporter=list
```

**Expected output:**
```
Running 23 tests using 6 workers
 23 passed (1.6s)
```

### Run Specific Test Suite
```bash
# Test AC1 only (Drizzle installation)
npx playwright test tests/acceptance/database/schema.spec.ts -g "AC1"

# Test AC3 only (Suggestions table)
npx playwright test tests/acceptance/database/schema.spec.ts -g "AC3"

# Test AC7 only (Migrations)
npx playwright test tests/acceptance/database/schema.spec.ts -g "AC7"
```

### Run Tests in Headed Mode
```bash
npx playwright test tests/acceptance/database/schema.spec.ts --headed
```

### Debug Specific Test
```bash
npx playwright test tests/acceptance/database/schema.spec.ts -g "GIVEN Database schema WHEN querying users table" --debug
```

### Generate HTML Report
```bash
npx playwright test tests/acceptance/database/schema.spec.ts --reporter=html
npx playwright show-report
```

---

## Test Coverage Summary

| Acceptance Criterion | Tests | Status | Coverage |
|---------------------|-------|--------|----------|
| AC1: Drizzle ORM Installed and Configured | 3 | ✅ PASSING | 100% |
| AC2: Users Table Defined | 3 | ✅ PASSING | 100% |
| AC3: Suggestions Table Defined | 4 | ✅ PASSING | 100% |
| AC4: Lottery Results Table Defined | 3 | ✅ PASSING | 100% |
| AC5: Prizes Table Defined | 3 | ✅ PASSING | 100% |
| AC6: TypeScript Types Exported | 2 | ✅ PASSING | 100% |
| AC7: Migrations Generated and Applied | 3 | ✅ PASSING | 100% |
| AC8: Schema Validation and Documentation | 2 | ✅ PASSING | 100% |
| **TOTAL** | **23** | **✅ GREEN** | **100%** |

---

## Next Steps

### ✅ Story 1.3 Complete

All acceptance criteria validated with passing tests. Schema is production-ready.

### Next Story: 1.4 - Configure NextAuth v5 Magic Link

**Unblocked:** Users table now available for NextAuth adapter.

**ATDD Process for Story 1.4:**
1. Draft Story 1.4 with clear acceptance criteria
2. Generate context with `*gen-story-context`
3. **Run `*testarch-atdd` BEFORE implementation** (RED phase)
4. Implement code to pass tests (GREEN phase)
5. Refactor with confidence (tests provide safety net)
6. Run `*code-review` for final validation

---

## Deliverable Files

### Test Files Created
- ✅ `tests/acceptance/database/schema.spec.ts` (600+ lines, 23 tests)

### Supporting Infrastructure
- ✅ Existing database connection helper reused (`lib/db/index.ts`)
- ✅ No data factories needed (schema-only tests)
- ✅ No fixtures needed (direct database queries)

### Documentation
- ✅ This ATDD checklist document
- ✅ README.md Database Schema section (created in Story 1.3 implementation)

---

## Knowledge Base References

**Applied in test design:**
- ✅ `test-quality.md` - Deterministic tests, explicit assertions, cleanup
- ✅ `fixture-architecture.md` - Auto-cleanup pattern with afterAll hook
- ✅ Given-When-Then format for readability

**Recommended for future stories:**
- `test-levels-framework.md` - E2E vs API vs Component decision framework
- `network-first.md` - Route interception for UI tests
- `data-factories.md` - Factory patterns with faker for test data
- `component-tdd.md` - Component test strategies with red-green-refactor

---

## Validation Checklist

- [x] Story acceptance criteria analyzed and mapped to tests
- [x] Appropriate test level selected (Acceptance/E2E level)
- [x] All tests written in Given-When-Then format
- [x] All tests passing (GREEN phase)
- [x] Database connection cleanup implemented
- [x] Test execution commands documented
- [x] Knowledge base patterns applied
- [x] Output file created and formatted correctly
- [x] Test coverage: 100% of acceptance criteria

**ATDD workflow complete for Story 1.3** ✅
