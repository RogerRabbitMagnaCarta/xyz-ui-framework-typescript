// src/core/factory.ts
import { TEST_ENGINE } from '../../config';
import type { BrowserAdapter } from './adapter';
import { PlaywrightAdapter } from '../adapters/playwright';
import { PuppeteerAdapter }  from '../adapters/puppeteer';
import { WebdriverIOAdapter } from '../adapters/webdriverio';

export function createAdapter(): BrowserAdapter {
  switch (TEST_ENGINE.toLowerCase()) {
    case 'puppeteer':
      return new PuppeteerAdapter();
    case 'webdriverio':
    case 'wdio':
      return new WebdriverIOAdapter();
    case 'playwright':
    default:
      return new PlaywrightAdapter();
  }
}
