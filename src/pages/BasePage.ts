import { open } from '../core/actions';

export abstract class BasePage {
  abstract path: string;

  async open(): Promise<void> {
    await open(this.path);
  }
}
