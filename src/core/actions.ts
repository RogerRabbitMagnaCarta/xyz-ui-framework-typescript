// src/core/actions.ts

import type { BrowserAdapter } from './adapter';
import { createAdapter }      from './factory';

let adapter: BrowserAdapter;

/**
 * Initialize the chosen adapter and launch the browser.
 */
export async function launch(): Promise<void> {
  adapter = createAdapter();
  await adapter.launch();
}

/**
 * Close the browser at the end of the run.
 */
export async function close(): Promise<void> {
  await adapter.close();
}

/**
 * Navigate to a full URL or BASE_URL + path.
 */
export async function open(path: string): Promise<void> {
  await adapter.open(path);
}

/**
 * Click an element by CSS selector.
 */
export async function click(selector: string): Promise<void> {
  await adapter.click(selector);
}

/**
 * Type text into an element by CSS selector.
 */
export async function type(selector: string, text: string): Promise<void> {
  await adapter.type(selector, text);
}

/**
 * Read the text content of an element.
 */
export async function getText(selector: string): Promise<string> {
  return adapter.getText(selector);
}

/**
 * Take a screenshot, saving to the given file path.
 */
export async function screenshot(path: string): Promise<void> {
  await adapter.screenshot(path);
}

export async function waitForSelector(
  selector: string,
  timeoutMs?: number
): Promise<void> {
  return adapter.waitForSelector(selector, timeoutMs);
}

export async function selectOption(
  selector: string,
  labelOrValue: string
): Promise<void> {
  return adapter.selectOption(selector, labelOrValue);
}



/**
 * Return any console/page errors caught since last navigation.
 */
export function getPageErrors(): string[] {
  return adapter.getPageErrors();
}

/**
 * Throws if there were any console/page errors since last navigation.
 */
export function assertNoPageErrors(): void {
  const errors = adapter.getPageErrors();
  if (errors.length > 0) {
    throw new Error(`Page errors detected:\n- ${errors.join('\n- ')}`);
  }
}

/**
 * Read the browser’s HTML5 validationMessage for the given input selector.
 */
export async function getValidationMessage(
  selector: string
): Promise<string> {
  return adapter.getValidationMessage(selector);
}

/**
 * After a form‐submit that triggers a JS alert/dialog, return its text.
 */
export async function getDialogText(): Promise<string> {
  // Make sure your adapters implement getLastDialogText()
  return (adapter as any).getLastDialogText();
}

/**
 * Return the number of elements matching selector.
 */
export async function count(selector: string): Promise<number> {
  return adapter.count(selector);
}

