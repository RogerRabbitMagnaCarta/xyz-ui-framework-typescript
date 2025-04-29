import { log, error } from './logger';
import * as path from 'path';
import { screenshot } from '../core/actions';

export async function reportSuccess(testName: string): Promise<void> {
  log(`✅ ${testName} passed`);
}

export async function reportFailure(testName: string, err: Error): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotsDir = process.env.SCREENSHOTS_DIR || 'screenshots';
  const filename = `${testName}-${timestamp}.png`;
  const screenshotPath = path.join(screenshotsDir, filename);

  error(`${testName} failed: ${err.message}`);
  try {
    await screenshot(screenshotPath);
    error(`Screenshot saved at ${screenshotPath}`);
  } catch (captureErr: unknown) {
    const errMsg = captureErr instanceof Error
      ? captureErr.message
      : String(captureErr);
    error(`Failed to capture screenshot: ${errMsg}`);
  }
  
}
