// src/adapters/puppeteer.ts

import puppeteer, { Browser, Page, Dialog } from 'puppeteer';
import type { BrowserAdapter }               from '../core/adapter';
import { BASE_URL, BROWSER, HEADLESS, SLOWMO } from '../../config';

export class PuppeteerAdapter implements BrowserAdapter {
  private browser!: Browser;
  private page!: Page;
  private errors: string[] = [];
  private lastDialogText = '';

  async launch(): Promise<void> {
    if (BROWSER !== 'chromium') {
      console.warn(
        `[PuppeteerAdapter] Puppeteer only supports Chromium; ignoring BROWSER=${BROWSER}`
      );
    }
    this.browser = await puppeteer.launch({ headless: HEADLESS, slowMo: SLOWMO });
    this.page    = await this.browser.newPage();

    this.page.on('pageerror', (err: Error) => {
      this.errors.push(`pageerror: ${err.message}`);
    });

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.errors.push(`console.error: ${msg.text()}`);
      }
    });

    this.page.on('dialog', async (dialog: Dialog) => {
      this.lastDialogText = dialog.message();
      await dialog.accept();
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
    await this.page.type(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return this.page.$eval(selector, el => el.textContent || '');
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }

  async waitForSelector(selector: string, timeoutMs?: number): Promise<void> {
    await this.page.waitForSelector(selector, {
      visible: true,
      timeout: timeoutMs ?? 30000
    });
  }


  async selectOption(selector: string, labelOrValue: string) {
    await this.page.waitForSelector(selector);
    await this.page.$eval(
      selector,
      (el, val) => {
        (el as HTMLSelectElement).value = 
          Array.from((el as HTMLSelectElement).options)
            .find(o => o.text === val || o.value === val)!.value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      labelOrValue
    );
  }

  getPageErrors(): string[] {
    return this.errors;
  }

// src/adapters/puppeteer.ts

async getValidationMessage(selector: string): Promise<string> {
  // wait for the element to be present
  await this.page.waitForSelector(selector, { visible: true });
  // cast el to HTMLInputElement inside the callback
  return this.page.$eval(
    selector,
    (el) => (el as HTMLInputElement).validationMessage
  );
}

async count(selector: string): Promise<number> {
  const els = await this.page.$$(selector);
  return els.length;
}

  /** Adapter-specific getter for text of the last dialog() */
  getLastDialogText(): string {
    return this.lastDialogText;
  }
}
