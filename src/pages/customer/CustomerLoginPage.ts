import { BasePage } from '../BasePage';
import {
  open,
  click,
  selectOption,
  waitForSelector,
  assertNoPageErrors
} from '../../core/actions';

export class CustomerLoginPage extends BasePage {
  path            = '/#/login';
  customerSelect  = 'select[ng-model="custId"]';
  loginBtn        = 'button[type="submit"]';

  async openAndVerify(): Promise<void> {
    await open(this.path);
    await waitForSelector(this.customerSelect);
    assertNoPageErrors();
  }

  async loginAs(name: string): Promise<void> {
    await selectOption(this.customerSelect, name);
    await click(this.loginBtn);
  }
}
