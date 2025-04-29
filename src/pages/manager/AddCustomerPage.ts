import { BasePage } from '../BasePage';
import { Header }   from '../components/Header';
import {
  click,
  type,
  waitForSelector,
  assertNoPageErrors,
  getValidationMessage,
  getText
} from '../../core/actions';

export interface AddCustomerResult {
  success:    boolean;
  customerId?: string;
  message:    string;
}

export class AddCustomerPage extends BasePage {
  path   = '/#/manager';
  header = new Header();

  addCustomerBtn = 'button[ng-click="addCust()"]';
  firstNameInput = 'input[ng-model="fName"]';
  lastNameInput  = 'input[ng-model="lName"]';
  postCodeInput  = 'input[ng-model="postCd"]';
  submitFormBtn  = 'button[type="submit"]';

  private messageBox = '.messageBox, .alert, .ng-binding';

  async openAndVerify(): Promise<void> {
    await this.open();
    await waitForSelector(this.addCustomerBtn);
    await click(this.addCustomerBtn);
    await waitForSelector(this.firstNameInput);
    assertNoPageErrors();
  }

  async submitCustomerForm(
    firstName: string,
    lastName:  string,
    postCode:  string
  ): Promise<void> {
    await type(this.firstNameInput, firstName);
    await type(this.lastNameInput, lastName);
    await type(this.postCodeInput, postCode);
    await click(this.submitFormBtn);
  }

  async getFieldError(selector: string): Promise<string> {
    return getValidationMessage(selector);
  }

  async addCustomer(
    firstName: string,
    lastName:  string,
    postCode:  string
  ): Promise<AddCustomerResult> {
    await this.openAndVerify();
    await this.submitCustomerForm(firstName, lastName, postCode);
    await waitForSelector(this.messageBox);
    const msg = await getText(this.messageBox);
    const m = msg.match(/Customer added successfully with customer id\s*:\s*(\d+)/i);
    if (m) {
      return { success: true, customerId: m[1], message: msg };
    }
    return { success: false, message: msg };
  }
}
