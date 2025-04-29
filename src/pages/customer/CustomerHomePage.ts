import { BasePage } from '../BasePage';
import {
  click,
  selectOption,
  waitForSelector,
  getText,
  assertNoPageErrors
} from '../../core/actions';

export interface AccountDetails {
  accountNo: string;
  balance:   number;
  currency:  string;
}

export class CustomerHomePage extends BasePage {
  path                 = '/#/customer';
  homeBtn              = 'button.home';
  logoutBtn            = 'button.logout';
  welcomeLine          = 'div.center:has-text("Welcome")';
  private welcomeNameSel = 'span.fontBig.ng-binding';
  accountDropdown      = 'select[ng-model="accountNo"]';
  detailLine           = 'div.center:has-text("Account Number")';
  transactionsTab      = 'button[ng-click="transactions()"]';
  depositTab           = 'button[ng-click="deposit()"]';
  withdrawalTab        = 'button[ng-click="withdrawl()"]';

  async openAndVerify(): Promise<void> {
    await this.open();
    await waitForSelector(this.accountDropdown);
    assertNoPageErrors();
  }

  async clickHome(): Promise<void> {
    await click(this.homeBtn);
  }

  async clickLogout(): Promise<void> {
    await click(this.logoutBtn);
  }

  async getWelcomeName(): Promise<string> {
    const name = await getText(this.welcomeNameSel);
    return name.trim();
  }

  async selectAccount(accountNo: string): Promise<void> {
    await selectOption(this.accountDropdown, accountNo);
    await waitForSelector(this.detailLine);
  }

  async getAccountDetails(): Promise<AccountDetails> {
    const detail = await getText(this.detailLine);
    const m = detail.match(
      /Account Number\s*:\s*(\d+)\s*,\s*Balance\s*:\s*(\d+)\s*,\s*Currency\s*:\s*(\w+)/
    );
    if (!m) throw new Error(`Unexpected account detail format: "${detail}"`);
    return {
      accountNo: m[1],
      balance:   parseInt(m[2], 10),
      currency:  m[3]
    };
  }

  async clickTransactions(): Promise<void> {
    await click(this.transactionsTab);
  }

  async clickDeposit(): Promise<void> {
    await click(this.depositTab);
  }

  async clickWithdrawal(): Promise<void> {
    await click(this.withdrawalTab);
  }

  async waitForDashboard(): Promise<void> {
    await waitForSelector(this.accountDropdown);
  }
}