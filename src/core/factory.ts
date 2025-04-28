// src/core/factory.ts
import { PlaywrightAdapter } from '../adapters/playwright';
import { PuppeteerAdapter } from '../adapters/puppeteer';
import { CypressAdapter } from '../adapters/cypress';
import type { BrowserAdapter } from './adapter';

export function createAdapter(): BrowserAdapter {
  const engine = (process.env.TEST_ENGINE || 'playwright').toLowerCase();
  switch (engine) {
    case 'puppeteer':
      return new PuppeteerAdapter();
    case 'cypress':
      return new CypressAdapter();
    case 'playwright':
    default:
      return new PlaywrightAdapter();
  }
}
