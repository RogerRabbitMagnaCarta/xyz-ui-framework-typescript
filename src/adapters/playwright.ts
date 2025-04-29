// src/adapters/playwright.ts

import { chromium, firefox, webkit, Browser, Page, ConsoleMessage, Dialog } from 'playwright';
import type { BrowserAdapter } from '../core/adapter';
import { BASE_URL, BROWSER, HEADLESS, SLOWMO } from '../../config';

export class PlaywrightAdapter implements BrowserAdapter {
  private browser!: Browser;
  private page!: Page;
  private errors: string[] = [];
  private lastDialogText = '';

  async launch(): Promise<void> {
    // choose engine based on BROWSER env var
    switch (BROWSER) {
      case 'firefox':
        this.browser = await firefox.launch({ headless: HEADLESS, slowMo: SLOWMO });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ headless: HEADLESS, slowMo: SLOWMO });
        break;
      case 'chromium':
      default:
        this.browser = await chromium.launch({ headless: HEADLESS, slowMo: SLOWMO });
    }
    this.page = await this.browser.newPage();

    // capture runtime errors and console errors
    this.page.on('pageerror', (err: Error) => {
      this.errors.push(`pageerror: ${err.message}`);
    });
    this.page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        this.errors.push(`console.error: ${msg.text()}`);
      }
    });

    // capture native dialogs
    this.page.on('dialog', (dialog: Dialog) => {
      this.lastDialogText = dialog.message();
      dialog.accept();
    });
  }

  async close(): Promise<void> {
    await this.browser.close();
  }

  async open(path: string): Promise<void> {
    this.errors = [];
    const url = path.startsWith('http') ? path : BASE_URL + path;
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    const content = await this.page.textContent(selector);
    return content === null ? '' : content;
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }

  async waitForSelector(selector: string, timeoutMs?: number): Promise<void> {
    await this.page.waitForSelector(selector, {
      state:   'visible',
      timeout: timeoutMs ?? 30000
    });
  }

  async selectOption(selector: string, labelOrValue: string): Promise<void> {
    // Use label first; fallback to value
    await this.page.waitForSelector(selector);
    await this.page.selectOption(selector, [
      { label: labelOrValue },
      { value: labelOrValue }
    ]);
  }

  getPageErrors(): string[] {
    return this.errors;
  }

  getLastDialogText(): string {
    return this.lastDialogText;
  }

  async getValidationMessage(selector: string): Promise<string> {
    await this.page.waitForSelector(selector, { state: 'attached', timeout: 30000 });
    return this.page.$eval(
      selector,
      el => (el as HTMLInputElement).validationMessage
    );
  }

  async count(selector: string): Promise<number> {
    await this.page.waitForSelector(selector, { state: 'attached', timeout: 30000 });
    return this.page.$$eval(selector, (els: Element[]) => els.length);
  }
}
