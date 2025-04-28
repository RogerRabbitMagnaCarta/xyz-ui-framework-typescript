// src/adapters/webdriverio.ts
import { remote, Browser as WDIOBrowser } from 'webdriverio';
import type { BrowserAdapter } from '../core/adapter';
import { BASE_URL, HEADLESS, SLOWMO } from '../../config';

export class WebdriverIOAdapter implements BrowserAdapter {
  private browser!: WDIOBrowser;

  async launch(): Promise<void> {
    // Chrome options go under 'goog:chromeOptions'
    const chromeOptions = {
      args: HEADLESS
        ? ['--headless', '--disable-gpu', '--window-size=1920,1080']
        : ['--window-size=1920,1080']
    };

    this.browser = await remote({
      logLevel: 'error',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': chromeOptions
      }
    });
  }

  async close(): Promise<void> {
    await this.browser.deleteSession();
  }

  async open(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : BASE_URL + path;
    console.log('[WebdriverIOAdapter] navigating to:', url);
    await this.browser.url(url);
  }

  async click(selector: string): Promise<void> {
    const elem = await this.browser.$(selector);
    await elem.click();
  }

  async type(selector: string, text: string): Promise<void> {
    const elem = await this.browser.$(selector);
    await elem.setValue(text);
  }

  async getText(selector: string): Promise<string> {
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  async screenshot(path: string): Promise<void> {
    await this.browser.saveScreenshot(path);
  }
}
