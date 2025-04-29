import { BasePage } from '../BasePage';
import {
  click,
  waitForSelector,
  type,
  getValidationMessage,
  getText,
  count,
  assertNoPageErrors
} from '../../core/actions';

export interface Transaction {
  type:   string;
  amount: string;
  date:   string;
}

export class CustomerDepositPage extends BasePage {
  path               = '/#/customer';
  private depositTab = 'button[ng-click="deposit()"]';
  private amountInput   = 'input[ng-model="amount"]';
  private submitBtn     = 'button[type="submit"]';
  private messageSel    = '.error, .messageBox';
  private balanceSel    = 'div.center:has-text("Balance")';
  private txRowsSel     = 'table tbody tr.ng-scope';

  constructor() {
    super();
  }

  async openAndVerify(): Promise<void> {
    await this.open();
    await click(this.depositTab);
    await waitForSelector(this.amountInput);
    assertNoPageErrors();
  }

  async submitAmount(amount: string): Promise<void> {
    await type(this.amountInput, amount);
    await click(this.submitBtn);
  }

  async getValidationError(): Promise<string> {
    return getValidationMessage(this.amountInput);
  }

  async getConfirmationMessage(): Promise<string> {
    await waitForSelector(this.messageSel);
    return getText(this.messageSel);
  }

  async getBalanceText(): Promise<string> {
    await waitForSelector(this.balanceSel);
    return getText(this.balanceSel);
  }

  async getTransactionCount(): Promise<number> {
    return count(this.txRowsSel);
  }

  async getLatestTransaction(): Promise<Transaction> {
    const total = await this.getTransactionCount();
    const row   = total;
    const type  = await getText(`table tbody tr:nth-child(${row}) td:nth-child(1)`);
    const amt   = await getText(`table tbody tr:nth-child(${row}) td:nth-child(2)`);
    const date  = await getText(`table tbody tr:nth-child(${row}) td:nth-child(3)`);
    return { type: type.trim(), amount: amt.trim(), date: date.trim() };
  }
}