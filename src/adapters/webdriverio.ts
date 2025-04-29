// src/adapters/webdriverio.ts

import { remote, Browser as WDIOBrowser } from 'webdriverio';
import type { BrowserAdapter }            from '../core/adapter';
import { BASE_URL, BROWSER, HEADLESS }    from '../../config';

interface BrowserLog {
  level:   string;
  message: string;
  [key: string]: any;
}

export class WebdriverIOAdapter implements BrowserAdapter {
  private browser!: WDIOBrowser;
  private errors: string[] = [];
  private lastDialogText = '';

  /** Launch a new browser session based on BROWSER/HEADLESS */
  async launch(): Promise<void> {
    const browserName = ['firefox', 'safari'].includes(BROWSER) ? BROWSER : 'chrome';
    const chromeArgs = HEADLESS
      ? ['--headless', '--disable-gpu', '--window-size=1920,1080']
      : ['--window-size=1920,1080'];

    const capabilities: Record<string, any> = { browserName };
    if (browserName === 'chrome') {
      capabilities['goog:chromeOptions'] = { args: chromeArgs };
    }

    this.browser = await remote({
      logLevel: 'error',
      capabilities
    });

    // Capture native browser dialogs and stash the message
    this.browser.on('dialog', async (dialog) => {
      this.lastDialogText = dialog.message();
      await dialog.accept();
    });
  }

  /** End the session */
  async close(): Promise<void> {
    await this.browser.deleteSession();
  }

  /**
   * Navigate to a URL or BASE_URL+path, resetting errors and
   * collecting any SEVERE console logs.
   */
  async open(path: string): Promise<void> {
    this.errors = [];
    const url = path.startsWith('http') ? path : BASE_URL + path;
    await this.browser.url(url);

    let rawLogs: object[] = [];
    try {
      rawLogs = await this.browser.getLogs('browser');
    } catch {
      // getLogs may not be supported
    }
    for (const entry of (rawLogs as BrowserLog[])) {
      if (entry.level === 'SEVERE') {
        this.errors.push(`browser.${entry.level}: ${entry.message}`);
      }
    }
  }

  /** Click an element by CSS selector */
  async click(selector: string): Promise<void> {
    const elem = await this.browser.$(selector);
    await elem.click();
  }

  /** Type text into an element by CSS selector */
  async type(selector: string, text: string): Promise<void> {
    const elem = await this.browser.$(selector);
    await elem.setValue(text);
  }

  /** Get text content of an element */
  async getText(selector: string): Promise<string> {
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  /** Save a screenshot to the given path */
  async screenshot(path: string): Promise<void> {
    await this.browser.saveScreenshot(path);
  }

  /**
   * Wait until the element is displayed.
   * @param timeoutMs maximum wait time in ms (default 30s)
   */
  async waitForSelector(selector: string, timeoutMs?: number): Promise<void> {
    const elem = await this.browser.$(selector);
    await elem.waitForDisplayed({ timeout: timeoutMs ?? 30000 });
  }

  async selectOption(selector: string, labelOrValue: string): Promise<void> {
    // 1) find the <select>
    const el = await this.browser.$(selector);
    await el.waitForExist({ timeout: 30000 });

    // 2) try selecting by visible text
    try {
      await el.selectByVisibleText(labelOrValue);
    } catch {
      // 3) fallback to selecting by value attribute
      await el.selectByAttribute('value', labelOrValue);
    }
  }

  /** Return any captured console/page errors */
  getPageErrors(): string[] {
    return this.errors;
  }

  /** Return the last dialog() text that was captured */
  getLastDialogText(): string {
    return this.lastDialogText;
  }

  /**
   * Read the native HTML5 validationMessage for an input selector.
   */
  async getValidationMessage(selector: string): Promise<string> {
    const elem = await this.browser.$(selector);
    await elem.waitForExist({ timeout: 30000 });
    const message = await this.browser.execute(
      (sel: string) => {
        const el = document.querySelector(sel) as HTMLInputElement;
        return el.validationMessage;
      },
      selector
    );
    return message as string;
  }

  async count(selector: string): Promise<number> {
    const elems = await this.browser.$$(selector);
    return elems.length;
  }
}
