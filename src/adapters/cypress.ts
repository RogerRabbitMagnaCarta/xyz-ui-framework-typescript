// src/adapters/cypress.ts
import type { BrowserAdapter } from '../core/adapter';
import { BASE_URL, HEADLESS, SLOWMO } from '../../config';

export class CypressAdapter implements BrowserAdapter {
  async launch(): Promise<void> {}
  async close(): Promise<void> {}
  async open(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : BASE_URL + path;
    cy.visit(url);
  }
  async click(selector: string): Promise<void> { cy.get(selector).click(); }
  async type(selector: string, text: string): Promise<void> { cy.get(selector).type(text); }
  async getText(selector: string): Promise<string> { return cy.get(selector).invoke('text') as unknown as Promise<string>; }
  async screenshot(path: string): Promise<void> { cy.screenshot(path); }
}