
import type { BrowserAdapter } from './adapter';
import { createAdapter } from './factory';

let adapter: BrowserAdapter;

export function initAdapter(): void {
  adapter = createAdapter();
}

export async function launch(): Promise<void> {
  initAdapter();
  await adapter.launch();
}

export async function close(): Promise<void> {
  await adapter.close();
}

export async function open(path: string): Promise<void> {
  await adapter.open(path);
}

export async function click(selector: string): Promise<void> {
  await adapter.click(selector);
}

export async function type(selector: string, text: string): Promise<void> {
  await adapter.type(selector, text);
}

export async function getText(selector: string): Promise<string> {
  return adapter.getText(selector);
}

export async function screenshot(path: string): Promise<void> {
  await adapter.screenshot(path);
}
