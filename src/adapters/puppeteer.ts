// src/adapters/puppeteer.ts
import puppeteer, { Browser, Page } from 'puppeteer';
import type { BrowserAdapter } from '../core/adapter';
import { BASE_URL, HEADLESS, SLOWMO } from '../../config';

export class PuppeteerAdapter implements BrowserAdapter {
  private browser!: Browser;
  private page!: Page;

  async launch(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: HEADLESS, slowMo: SLOWMO });
    this.page = await this.browser.newPage();
  }

  async close(): Promise<void> {
    await this.browser.close();
  }

  async open(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : BASE_URL + path;
    console.log('[PuppeteerAdapter] navigating to:', url);
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.page.type(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.$eval(selector, el => el.textContent)) || '';
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}