// tests/jira-1/jira-1-success.spec.ts

import { faker } from '@faker-js/faker';
import {
  launch,
  close,
  getDialogText,
  waitForSelector,
  getText
} from '../../src/core/actions';
import { AddCustomerPage } from '../../src/pages/manager/AddCustomerPage';
import { ManagerPage }     from '../../src/pages/manager/ManagerPage';

jest.setTimeout(60000);

describe('[JIRA1] Create Customer – success flow', () => {
  let addPage: AddCustomerPage;
  let managerPage: ManagerPage;

  beforeAll(async () => {
    await launch();
    addPage     = new AddCustomerPage();
    managerPage = new ManagerPage();
  });

  afterAll(async () => {
    await close();
  });

  it('creates a new customer and shows success dialog + table entry', async () => {
    // 1) Prepare random valid data
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    const postCode  = faker.location.zipCode('#####');

    // 2) Open form
    await addPage.openAndVerify();

    // 3) Submit valid form
    await addPage.submitCustomerForm(firstName, lastName, postCode);

    // 4) Capture and assert the alert/dialog text
    const alertText = await getDialogText();
    console.log('Alert dialog text:', alertText);
    expect(alertText).toMatch(
      /Customer added successfully with customer id\s*:\s*\d+/i
    );

    // 5) Verify the new record appears in the Customers table
    await managerPage.clickShowCustomers();
    await waitForSelector('table tbody tr:last-child td');

    const [rowFirst, rowLast, rowPost] = await Promise.all([
      getText('table tbody tr:last-child td:nth-child(1)'),
      getText('table tbody tr:last-child td:nth-child(2)'),
      getText('table tbody tr:last-child td:nth-child(3)') 
    ]);

    expect(rowFirst).toBe(firstName);
    expect(rowLast).toBe(lastName);
    expect(rowPost).toBe(postCode);
  });
});
