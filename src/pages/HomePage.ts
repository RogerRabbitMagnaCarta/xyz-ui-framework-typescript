import { BasePage } from './BasePage';
import { Header }   from './components/Header';
import {
  open,
  getText,
  click,
  assertNoPageErrors,
  waitForSelector
} from '../core/actions';

export class HomePage extends BasePage {
  path   = '/';
  header = new Header();
  customerLoginBtn    = 'button[ng-click="customer()"]';
  managerLoginBtn     = 'button[ng-click="manager()"]';

  async openAndVerify(): Promise<void> {
    await open(this.path);
    await waitForSelector('div[ui-view]');
    assertNoPageErrors();
  }

async clickCustomerLogin(): Promise<void> {
    await click(this.customerLoginBtn);
    }

  async clickManagerLogin(): Promise<void> {
    await click(this.managerLoginBtn);
  }

  async getDocumentTitle(): Promise<string> {
    return (await getText('title')).trim();
  }
}
