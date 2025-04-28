// src/adapters/playwright.ts
import { chromium, Browser, Page } from 'playwright';
import type { BrowserAdapter } from '../core/adapter';
import { BASE_URL, HEADLESS, SLOWMO } from '../../config';

export class PlaywrightAdapter implements BrowserAdapter {
  private browser!: Browser;
  private page!: Page;

  async launch(): Promise<void> {
    this.browser = await chromium.launch({ headless: HEADLESS, slowMo: SLOWMO });
    this.page = await this.browser.newPage();
  }

  async close(): Promise<void> {
    await this.browser.close();
  }

  async open(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : BASE_URL + path;
    console.log('[PlaywrightAdapter] navigating to:', url);
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector)) || '';
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
