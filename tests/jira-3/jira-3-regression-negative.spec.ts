import { faker } from '@faker-js/faker';
import {
  launch,
  close,
  getDialogText
} from '../../src/core/actions';

import { HomePage }            from '../../src/pages/HomePage';
import { ManagerPage }         from '../../src/pages/manager/ManagerPage';
import { AddCustomerPage }     from '../../src/pages/manager/AddCustomerPage';
import { OpenAccountPage }     from '../../src/pages/manager/OpenAccountPage';
import { CustomersPage }       from '../../src/pages/manager/CustomersPage';
import { CustomerLoginPage }   from '../../src/pages/customer/CustomerLoginPage';
import { CustomerHomePage }    from '../../src/pages/customer/CustomerHomePage';
import { CustomerDepositPage } from '../../src/pages/customer/CustomerDepositPage';

jest.setTimeout(120000);

describe('[JIRA3] Full flow + empty‐amount deposit validation', () => {
  let home: HomePage;
  let manager: ManagerPage;
  let addCust: AddCustomerPage;
  let openAcct: OpenAccountPage;
  let custTable: CustomersPage;
  let custLogin: CustomerLoginPage;
  let custHome: CustomerHomePage;
  let depositPage: CustomerDepositPage;

  beforeAll(async () => {
    await launch();
    home        = new HomePage();
    manager     = new ManagerPage();
    addCust     = new AddCustomerPage();
    openAcct    = new OpenAccountPage();
    custTable   = new CustomersPage();
    custLogin   = new CustomerLoginPage();
    custHome    = new CustomerHomePage();
    depositPage = new CustomerDepositPage();
  });

  afterAll(async () => {
    await close();
  });

  it('validates empty deposit amount with HTML5 tooltip', async () => {
    // 1) Home → Manager Login
    await home.openAndVerify();
    await home.clickManagerLogin();

    // 2) Add Customer
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    const postCode  = faker.location.zipCode('#####');
    const fullName  = `${firstName} ${lastName}`;

    await addCust.openAndVerify();
    await addCust.submitCustomerForm(firstName, lastName, postCode);
    const addAlert = await getDialogText();
    expect(addAlert).toMatch(/Customer added successfully with customer id\s*:\d+/i);

    // 3) Open Account
    await manager.openAndVerify();
    await manager.clickOpenAccount();
    const currency   = faker.helpers.arrayElement(['Dollar','Pound','Rupee'] as const);
    const openResult = await openAcct.openAccount(fullName, currency);
    expect(openResult.success).toBe(true);

    // 4) Verify in Customers table
    const acctNo = openResult.accountNo!;
    const found  = await custTable.hasAccountForCustomer(firstName, lastName, acctNo);
    expect(found).toBe(true);

    // 5) Home → Customer Login
    await home.openAndVerify();
    await home.clickCustomerLogin();
    await custLogin.openAndVerify();

    // 6) Customer Login
    await custLogin.loginAs(fullName);

    // 7) Wait for Dashboard
    await custHome.waitForDashboard();

    // 8) Navigate to Deposit tab
    await custHome.clickDeposit();

    // 9) Submit empty amount
    await depositPage.submitAmount('');

    // 10) Assert HTML5 validation tooltip
    const validationMsg = await depositPage.getValidationError();
    expect(validationMsg).toMatch(/Please fill (?:out|in) this field\./i);
  });
});
