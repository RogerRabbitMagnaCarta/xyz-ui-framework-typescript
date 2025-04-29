// tests/e2e/full-customer-journey.spec.ts

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

describe('[JIRA3] Full end-to-end journey: manager adds+opens → customer logs in → deposit', () => {
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

  it('runs the full flow, then logs in as that customer and makes a deposit', async () => {
    //1) Home → Manager Login
    await home.openAndVerify();
    await home.clickManagerLogin();

    //2) Add a brand-new customer
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    const postCode  = faker.location.zipCode('#####');
    const fullName  = `${firstName} ${lastName}`;

    await addCust.openAndVerify();
    await addCust.submitCustomerForm(firstName, lastName, postCode);
    const addAlert = await getDialogText();
    expect(addAlert).toMatch(/Customer added successfully with customer id\s*:\d+/i);

    //3) Open an account for them
    await manager.openAndVerify();
    await manager.clickOpenAccount();
    const currency   = faker.helpers.arrayElement(['Dollar','Pound','Rupee'] as const);
    const openResult = await openAcct.openAccount(fullName, currency);
    expect(openResult.success).toBe(true);
    expect(openResult.message).toMatch(/Account created successfully with account Number\s*:\d+/i);

    // 4) Verify it shows up in the Customers table ─
    const acctNo = openResult.accountNo!;
    const found  = await custTable.hasAccountForCustomer(firstName, lastName, acctNo);
    expect(found).toBe(true);

    // 5) Now switch back to Home → Customer Login ──
    await home.openAndVerify();
    await home.clickCustomerLogin();

    //  6) Confirm we see the customer‐login form 
    await custLogin.openAndVerify();

    //  7) Log in as that customer 
    await custLogin.loginAs(fullName);

    //  8) Wait for and verify the customer dashboard ─
    await custHome.waitForDashboard();
    const welcomeName = await custHome.getWelcomeName();
    expect(welcomeName).toBe(fullName);
    const details = await custHome.getAccountDetails();
    expect(details.accountNo).toBe(acctNo);

    //  9) Remember the initial balance 
    const initialBalance = details.balance;

    //  10) Switch to the Deposit tab 
    await custHome.clickDeposit();

    //  11) Deposit 10 and assert success message 
    await depositPage.submitAmount('10');
    const depositMsg = await depositPage.getConfirmationMessage();
    expect(depositMsg).toMatch(/Deposit Successful/i);

    //  12) Verify new balance = old + 10 
    await custHome.waitForDashboard();
    const updatedDetails = await custHome.getAccountDetails();
    expect(updatedDetails.balance).toBe(initialBalance + 10);
  });
});
