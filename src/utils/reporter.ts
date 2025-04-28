import { log, error } from './logger';
import * as path from 'path';
import { screenshot } from '../core/actions';

/**
 * Reports a successful test execution.
 */
export async function reportSuccess(testName: string): Promise<void> {
  log(`✅ ${testName} passed`);
}

/**
 * Reports a failed test execution, takes a screenshot, and logs the error.
 */
export async function reportFailure(testName: string, err: Error): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotsDir = process.env.SCREENSHOTS_DIR || 'screenshots';
  const filename = `${testName}-${timestamp}.png`;
  const screenshotPath = path.join(screenshotsDir, filename);

  error(`❌ ${testName} failed: ${err.message}`);
  try {
    await screenshot(screenshotPath);
    error(`Screenshot saved at ${screenshotPath}`);
  } catch (captureErr: unknown) {
    // Narrow unknown → Error (or stringify fallback)
    const errMsg = captureErr instanceof Error
      ? captureErr.message
      : String(captureErr);
    error(`Failed to capture screenshot: ${errMsg}`);
  }
  
}
