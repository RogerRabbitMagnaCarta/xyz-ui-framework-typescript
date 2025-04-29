// tests/jira-3/jira-3-create-and-open-account.spec.ts

import { faker } from '@faker-js/faker';
import {
  launch,
  close,
  getDialogText
} from '../../src/core/actions';
import { AddCustomerPage } from '../../src/pages/manager/AddCustomerPage';
import { ManagerPage }     from '../../src/pages/manager/ManagerPage';
import { OpenAccountPage } from '../../src/pages/manager/OpenAccountPage';
import { CustomersPage }    from '../../src/pages/manager/CustomersPage';

jest.setTimeout(60000);

describe('[JIRA-3] Create customer then open account end-to-end', () => {
  let addPage: AddCustomerPage;
  let managerPage: ManagerPage;
  let openPage: OpenAccountPage;
  let custPage: CustomersPage;


  beforeAll(async () => {
    await launch();
    addPage     = new AddCustomerPage();
    managerPage = new ManagerPage();
    openPage    = new OpenAccountPage();
    custPage = new CustomersPage();

  });

  afterAll(async () => {
    await close();
  });

  it('creates a new customer, then opens an account for them', async () => {
    // 1) Generate random customer data
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    const postCode  = faker.location.zipCode('#####');
    const fullName  = `${firstName} ${lastName}`;


    // 2) Reveal and submit the Add Customer form
    await addPage.openAndVerify();
    await addPage.submitCustomerForm(firstName, lastName, postCode);

    // 3) Capture and assert the “customer added” alert
    const addAlert = await getDialogText();
    console.log('AddCustomer alert:', addAlert);
    expect(addAlert).toMatch(
      /Customer added successfully with customer id\s*:\s*\d+/i
    );

    // 4) Go back to Manager dashboard and open the “Open Account” tab
    await openPage.openAndVerify();
    await openPage.openAccount(fullName,"Dollar");
    

    // 5) Submit the Open Account form for our new customer
    const currency   = faker.helpers.arrayElement(['Dollar','Pound','Rupee'] as const);
    const { accountNo } = await openPage.openAccount(fullName, currency);


    expect(await custPage.hasAccountForCustomer(firstName,lastName, accountNo!)).toBe(true);    
    

  });
});
