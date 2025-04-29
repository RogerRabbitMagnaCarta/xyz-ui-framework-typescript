import { faker } from '@faker-js/faker';
import { launch, close } from '../../src/core/actions';
import { AddCustomerPage } from '../../src/pages/manager/AddCustomerPage';

jest.setTimeout(60000);

describe('[JIRA1] Required-fields validation', () => {
  let addPage: AddCustomerPage;

  beforeAll(async () => {
    await launch();
    addPage = new AddCustomerPage();
  });

  afterAll(async () => {
    await close();
  });

  const validFirst  = faker.person.firstName();
  const validLast   = faker.person.lastName();
  const validPost   = faker.location.zipCode('#####');

  const cases = [
    {
      name: 'all empty',
      inputs: ['', '', ''],
      selector: (p: AddCustomerPage) => p.firstNameInput
    },
    {
      name: 'last name empty',
      inputs: [validFirst, '', validPost],
      selector: (p: AddCustomerPage) => p.lastNameInput
    },
    {
      name: 'postcode empty',
      inputs: [validFirst, validLast, ''],
      selector: (p: AddCustomerPage) => p.postCodeInput
    }
  ] as const;

  const validationRegex = /Please fill (?:out|in) this field\./i;

  it.each(cases)(
    'when %s → shows native validation message',
    async ({ inputs: [first, last, post], selector }) => {
      await addPage.openAndVerify();
      await addPage.submitCustomerForm(first, last, post);
      const msg = await addPage.getFieldError(selector(addPage));
      expect(validationRegex.test(msg)).toBe(true);
    }
  );
});
