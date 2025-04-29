import { BasePage } from '../BasePage';
import {
  click,
  selectOption,
  waitForSelector,
  getDialogText,
  assertNoPageErrors
} from '../../core/actions';

export interface OpenAccountResult {
  success:    boolean;
  accountNo?: string;
  message:    string;
}

export class OpenAccountPage extends BasePage {
  path           = '/#/manager';
  openAccountBtn = 'button[ng-click="openAccount()"]';
  custSelect     = 'select[ng-model="custId"]';
  currencySelect = 'select[ng-model="currency"]';
  processBtn     = 'button[type="submit"]';

  async openAndVerify(): Promise<void> {
    await this.open();
    await waitForSelector(this.openAccountBtn);
    await click(this.openAccountBtn);
    await waitForSelector(this.custSelect);
    await waitForSelector(this.currencySelect);
    assertNoPageErrors();
  }

  async openAccount(
    customerName: string,
    currency:     string
  ): Promise<OpenAccountResult> {
    await this.openAndVerify();
    await selectOption(this.custSelect, customerName);
    await selectOption(this.currencySelect, currency);
    await click(this.processBtn);
    const msg = await getDialogText();
    const m   = msg.match(
      /Account created successfully with account Number\s*:(\d+)/i
    );

    if (m) {
      return { success: true, accountNo: m[1], message: msg };
    } else {
      return { success: false, message: msg };
    }
  }
}
