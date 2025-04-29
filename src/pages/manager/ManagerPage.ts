import { BasePage } from '../BasePage';
import { Header }   from '../components/Header';
import {
  click,
  getText,
  waitForSelector,
  assertNoPageErrors
} from '../../core/actions';

export class ManagerPage extends BasePage {
  path   = '/#/manager';
  header = new Header();

  private addCustomerBtn     = 'button[ng-click="addCust()"]';
  private openAccountBtn     = 'button[ng-click="openAccount()"]';
  private customersListBtn   = 'button[ng-click="showCust()"]';
  private transactionSummary = 'button[ng-click="showTrans()"]';

  async openAndVerify(): Promise<void> {
    await this.open();
    await waitForSelector(this.addCustomerBtn);
    assertNoPageErrors();
  }

  async clickAddCustomer(): Promise<void> {
    await click(this.addCustomerBtn);
  }

  async clickOpenAccount(): Promise<void> {
    await click(this.openAccountBtn);
    await waitForSelector('select[ng-model="custId"]');
    await waitForSelector('select[ng-model="currency"]');
  }

  async clickShowCustomers(): Promise<void> {
    await click(this.customersListBtn);
  }

  async clickShowTransactions(): Promise<void> {
    await click(this.transactionSummary);
  }

  async getBannerTitle(): Promise<string> {
    return this.header.getTitle();
  }
}
