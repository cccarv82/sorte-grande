import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const appRoot = join(__dirname, '../..');
const docsRoot = join(appRoot, '../docs');

test.describe('Story 1.2: Neon PostgreSQL Setup', () => {
  
  test('AC1: Neon project created with sa-east-1 region', async () => {
    // GIVEN: .env.local exists with DATABASE_URL
    const envPath = join(appRoot, '.env.local');
    expect(existsSync(envPath)).toBeTruthy();
    
    // WHEN: Reading connection string
    const envContent = readFileSync(envPath, 'utf-8');
    const databaseUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];
    
    // THEN: Connection string contains sa-east-1 region
    expect(databaseUrl).toBeDefined();
    expect(databaseUrl).toContain('sa-east-1.aws.neon.tech');
    expect(databaseUrl).toContain('?sslmode=require');
  });

  test('AC2: Database branches documented (3 branches: production, staging, development)', async () => {
    // GIVEN: Story documentation exists
    const storyPath = join(docsRoot, 'sprint-artifacts/1-2-setup-neon-postgresql.md');
    expect(existsSync(storyPath)).toBeTruthy();
    
    // WHEN: Reading story content
    const storyContent = readFileSync(storyPath, 'utf-8');
    
    // THEN: 3 branches are documented
    expect(storyContent).toContain('production');
    expect(storyContent).toContain('staging');
    expect(storyContent).toContain('development');
    expect(storyContent).toMatch(/3\s+branches/i);
  });

  test('AC3: PostgreSQL driver and dependencies installed', async () => {
    // GIVEN: package.json exists
    const packagePath = join(appRoot, 'package.json');
    expect(existsSync(packagePath)).toBeTruthy();
    
    // WHEN: Reading dependencies
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    
    // THEN: All required dependencies present with correct versions
    expect(packageJson.dependencies.pg).toMatch(/^\^?8\./);
    expect(packageJson.dependencies.dotenv).toMatch(/^\^?17\./);
    expect(packageJson.devDependencies['@types/pg']).toMatch(/^\^?8\./);
    expect(packageJson.devDependencies.tsx).toMatch(/^\^?4\./);
  });

  test('AC4: Environment variables configured (.env.local exists, .env.example safe)', async () => {
    // GIVEN: Both .env files exist
    const envLocalPath = join(appRoot, '.env.local');
    const envExamplePath = join(appRoot, '.env.example');
    
    expect(existsSync(envLocalPath)).toBeTruthy();
    expect(existsSync(envExamplePath)).toBeTruthy();
    
    // WHEN: Reading file contents
    const envLocal = readFileSync(envLocalPath, 'utf-8');
    const envExample = readFileSync(envExamplePath, 'utf-8');
    
    // THEN: .env.local has real DATABASE_URL, .env.example has placeholder
    expect(envLocal).toContain('DATABASE_URL=postgresql://');
    expect(envLocal).toContain('neondb_owner'); // Real credentials
    
    expect(envExample).toContain('DATABASE_URL');
    expect(envExample).not.toContain('neondb_owner'); // No real credentials
    expect(envExample).toMatch(/user:password@host/); // Placeholder format
  });

  test('AC4b: .env.local not tracked by git', async () => {
    // GIVEN: Git repository exists
    const gitRoot = appRoot;
    
    // WHEN: Checking git status for .env.local
    const gitStatus = execSync('git status --porcelain .env.local', {
      cwd: gitRoot,
      encoding: 'utf-8',
    }).trim();
    
    // THEN: .env.local should not appear in git status (ignored)
    expect(gitStatus).toBe('');
  });

  test('AC5: Connection helper created with singleton pattern and TypeScript compliance', async () => {
    // GIVEN: Connection helper file exists
    const dbIndexPath = join(appRoot, 'lib/db/index.ts');
    expect(existsSync(dbIndexPath)).toBeTruthy();
    
    // WHEN: Reading connection helper code
    const dbCode = readFileSync(dbIndexPath, 'utf-8');
    
    // THEN: Contains required patterns
    expect(dbCode).toContain('export function getDbConnection()');
    expect(dbCode).toContain('export async function closeDbConnection()');
    expect(dbCode).toContain('let pool: Pool | null = null'); // Singleton
    expect(dbCode).toContain('ssl:'); // SSL configuration
    expect(dbCode).toContain('max:'); // Connection pool config
    
    // AND: TypeScript compiles without errors
    const tscOutput = execSync('npx tsc --noEmit', {
      cwd: appRoot,
      encoding: 'utf-8',
    });
    expect(tscOutput).not.toContain('error TS');
  });

  test('AC6: Connection test script exists and passes', async () => {
    // GIVEN: Test connection script exists
    const testScriptPath = join(appRoot, 'lib/db/test-connection.ts');
    expect(existsSync(testScriptPath)).toBeTruthy();
    
    // WHEN: Running connection test
    const output = execSync('npx tsx lib/db/test-connection.ts', {
      cwd: appRoot,
      encoding: 'utf-8',
      timeout: 15000, // 15s timeout for network call
    });
    
    // THEN: Connection succeeds with expected output
    expect(output).toContain('✅ Database connected successfully');
    expect(output).toContain('PostgreSQL version:');
    expect(output).toMatch(/PostgreSQL 17\.\d+/); // PostgreSQL 17.x
    expect(output).toContain('Connection pool ready');
    expect(output).toContain('Connection closed');
  });

  test('AC7: README.md updated with Database Setup section', async () => {
    // GIVEN: README exists
    const readmePath = join(appRoot, 'README.md');
    expect(existsSync(readmePath)).toBeTruthy();
    
    // WHEN: Reading README content
    const readme = readFileSync(readmePath, 'utf-8');
    
    // THEN: Database Setup section present with complete documentation
    expect(readme).toContain('## Database Setup');
    expect(readme).toContain('Prerequisites');
    expect(readme).toContain('Environment Configuration');
    expect(readme).toContain('Test Connection');
    expect(readme).toContain('Troubleshooting');
    expect(readme).toContain('npx tsx lib/db/test-connection.ts');
    expect(readme).toContain('neon.tech');
  });

  test('AC8: Security best practices validated (SSL enforced, no secrets in git)', async () => {
    // GIVEN: .env.local and connection string exist
    const envPath = join(appRoot, '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const databaseUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];
    
    // WHEN: Validating security configuration
    
    // THEN: SSL is enforced in connection string
    expect(databaseUrl).toContain('sslmode=require');
    expect(databaseUrl).toContain('channel_binding=require');
    
    // AND: DATABASE_URL contains password (between : and @)
    expect(databaseUrl).toMatch(/:[^:@]+@/); // Password pattern
    
    // AND: .gitignore excludes .env.local
    const gitignorePath = join(appRoot, '.gitignore');
    const gitignore = readFileSync(gitignorePath, 'utf-8');
    expect(gitignore).toContain('.env*');
    expect(gitignore).toContain('!.env.example');
    
    // AND: Connection helper uses SSL config
    const dbCode = readFileSync(join(appRoot, 'lib/db/index.ts'), 'utf-8');
    expect(dbCode).toContain('ssl:');
    expect(dbCode).toContain('rejectUnauthorized: false'); // Required for Neon
  });
});
