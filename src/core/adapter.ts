export interface BrowserAdapter {
  launch(): Promise<void>;
  close(): Promise<void>;
  open(path: string): Promise<void>;
  click(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
  getText(selector: string): Promise<string>;
  screenshot(path: string): Promise<void>;
  waitForSelector(selector: string, timeoutMs?: number): Promise<void>;
  getPageErrors(): string[];
  getValidationMessage(selector: string): Promise<string>;
  getLastDialogText(): string;
  selectOption(selector: string, labelOrValue: string): Promise<void>;
  count(selector: string): Promise<number>;
}
