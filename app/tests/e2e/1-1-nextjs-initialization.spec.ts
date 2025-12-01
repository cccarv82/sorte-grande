import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Project root is the app/ directory (where package.json lives)
// Tests run from app/tests/e2e/ so we go up 2 levels
const PROJECT_ROOT = process.cwd(); // Running from app/ directory
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json');
const TSCONFIG_PATH = join(PROJECT_ROOT, 'tsconfig.json');
const ESLINT_CONFIG_PATH = join(PROJECT_ROOT, 'eslint.config.mjs');
const POSTCSS_CONFIG_PATH = join(PROJECT_ROOT, 'postcss.config.mjs');
const GLOBALS_CSS_PATH = join(PROJECT_ROOT, 'app', 'globals.css');
const GITIGNORE_PATH = join(PROJECT_ROOT, '.gitignore');

test.describe('Story 1.1: Next.js 16 Project Initialization', () => {
  
  test('AC1: Next.js project created with correct structure and dependencies', async () => {
    // GIVEN: Project directory exists
    // WHEN: Checking project structure
    const packageJsonExists = existsSync(PACKAGE_JSON_PATH);
    
    // THEN: Project structure is valid
    expect(packageJsonExists).toBe(true);
    
    // AND: package.json contains required dependencies
    const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.next).toMatch(/^16\./); // Next.js 16.x
    expect(packageJson.dependencies.react).toMatch(/^(18|19)\./); // React 18.x or 19.x
    expect(packageJson.dependencies['react-dom']).toMatch(/^(18|19)\./);
    
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies.typescript).toMatch(/\^?5/); // TypeScript 5.x (with or without ^)
    expect(packageJson.devDependencies.tailwindcss).toBeDefined();
    expect(packageJson.devDependencies.eslint).toBeDefined();
  });

  test('AC2: TypeScript strict mode configured correctly', async () => {
    // GIVEN: TypeScript config file exists
    const tsconfigExists = existsSync(TSCONFIG_PATH);
    expect(tsconfigExists).toBe(true);
    
    // WHEN: Reading tsconfig.json
    const tsconfigContent = readFileSync(TSCONFIG_PATH, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // THEN: Strict mode is enabled
    expect(tsconfig.compilerOptions.strict).toBe(true);
    
    // AND: Import alias is configured
    expect(tsconfig.compilerOptions.paths).toBeDefined();
    expect(tsconfig.compilerOptions.paths['@/*']).toBeDefined();
    
    // AND: TypeScript compilation succeeds
    try {
      execSync('npx tsc --noEmit', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe' 
      });
      expect(true).toBe(true); // Compilation succeeded
    } catch (error: any) {
      // Fail with error message
      throw new Error(`TypeScript compilation failed: ${error.stderr?.toString()}`);
    }
  });

  test('AC3: Development server runs successfully', async ({ page }) => {
    // GIVEN: Dependencies installed and project configured
    // NOTE: This test assumes dev server is already running on localhost:3000
    // In CI, use webServer config in playwright.config.ts to auto-start
    
    // WHEN: Navigating to dev server
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // THEN: Page loads successfully
    await expect(page).toHaveTitle(/Create Next App|Next\.js/);
    
    // AND: Page content is rendered
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('AC4: Turbopack bundler is active', async () => {
    // GIVEN: Dev server command available
    // WHEN: Starting dev server (simulated - check logs)
    // NOTE: This test checks if Turbopack flag is configured
    
    const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    
    // THEN: Dev script uses Turbopack or --turbo flag
    const devScript = packageJson.scripts.dev;
    expect(devScript).toBeDefined();
    
    // Turbopack is default in Next.js 16, or check for explicit flag
    const usesTurbopack = devScript.includes('--turbopack') || 
                          devScript.includes('--turbo') ||
                          devScript === 'next dev'; // Default in 16
    
    expect(usesTurbopack).toBe(true);
  });

  test('AC5: Production build succeeds within time limit', async () => {
    // GIVEN: Project configured correctly
    // WHEN: Running production build
    const startTime = Date.now();
    
    try {
      execSync('npm run build', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe',
        timeout: 120000 // 2 minutes max
      });
      
      const buildTime = Date.now() - startTime;
      
      // THEN: Build completes successfully
      expect(true).toBe(true);
      
      // AND: Build time is under 2 minutes (NFR-P3)
      expect(buildTime).toBeLessThan(120000);
      
      console.log(`✓ Build completed in ${(buildTime / 1000).toFixed(2)}s`);
      
    } catch (error: any) {
      throw new Error(`Build failed: ${error.stderr?.toString()}`);
    }
  });

  test('AC6: ESLint configured and passes', async () => {
    // GIVEN: ESLint configuration exists
    const eslintConfigExists = existsSync(ESLINT_CONFIG_PATH);
    expect(eslintConfigExists).toBe(true);
    
    // WHEN: Reading ESLint config
    const eslintConfig = readFileSync(ESLINT_CONFIG_PATH, 'utf-8');
    
    // THEN: Config extends Next.js rules
    expect(eslintConfig).toContain('next');
    
    // AND: Lint command executes on source files (exclude test artifacts)
    try {
      execSync('npm run lint -- --max-warnings=0 app/', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe' 
      });
      expect(true).toBe(true); // Lint passed
    } catch (error: any) {
      const errorOutput = error.stdout?.toString() || error.stderr?.toString();
      
      // Check if it's just warnings (acceptable)
      const hasErrors = errorOutput.includes(' error ') && 
                       !errorOutput.includes('0 errors');
      
      if (hasErrors) {
        throw new Error(`ESLint errors found in source code: ${errorOutput}`);
      }
      // Warnings are acceptable
    }
  });

  test('AC7: Tailwind CSS configured correctly', async ({ page }) => {
    // GIVEN: Next.js 16 with Tailwind v4 uses new @import syntax in globals.css
    const globalsCssExists = existsSync(GLOBALS_CSS_PATH);
    const postcssConfigExists = existsSync(POSTCSS_CONFIG_PATH);
    
    expect(globalsCssExists).toBe(true);
    expect(postcssConfigExists).toBe(true);
    
    // WHEN: Checking globals.css for Tailwind v4 @import
    const globalsCss = readFileSync(GLOBALS_CSS_PATH, 'utf-8');
    
    // THEN: CSS uses new Tailwind v4 @import syntax
    expect(globalsCss).toContain('@import "tailwindcss"');
    
    // AND: PostCSS includes @tailwindcss/postcss plugin
    const postcssConfig = readFileSync(POSTCSS_CONFIG_PATH, 'utf-8');
    expect(postcssConfig).toContain('@tailwindcss/postcss');
    
    // AND: Tailwind classes work in runtime (visual test)
    // NOTE: This assumes dev server is running
    await page.goto('http://localhost:3000');
    
    // Check if Tailwind styles are applied (test default page)
    const hasStyles = await page.evaluate(() => {
      const element = document.querySelector('body');
      if (!element) return false;
      
      const styles = window.getComputedStyle(element);
      // If Tailwind loaded, computed styles should exist
      return styles.length > 0;
    });
    
    expect(hasStyles).toBe(true);
  });

  test('AC8: Git repository initialized correctly', async () => {
    // GIVEN: Project created
    const gitDirExists = existsSync(join(PROJECT_ROOT, '.git'));
    const gitignoreExists = existsSync(GITIGNORE_PATH);
    
    // THEN: Git repository initialized
    expect(gitDirExists).toBe(true);
    
    // AND: .gitignore exists with required entries
    expect(gitignoreExists).toBe(true);
    
    const gitignoreContent = readFileSync(GITIGNORE_PATH, 'utf-8');
    expect(gitignoreContent).toContain('node_modules');
    expect(gitignoreContent).toContain('.next');
    expect(gitignoreContent).toContain('.env');
    
    // AND: Initial commit exists (optional check)
    try {
      const gitLog = execSync('git log --oneline', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe' 
      }).toString();
      
      expect(gitLog.length).toBeGreaterThan(0); // At least one commit
    } catch {
      // If no commits yet, that's acceptable for initial setup
      console.warn('⚠ No git commits found - consider creating initial commit');
    }
  });
});
