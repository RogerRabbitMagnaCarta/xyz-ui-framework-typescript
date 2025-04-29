import {
    click,
    type,
    waitForSelector,
    getText,
    count
  } from '../../../src/core/actions';
  import { BasePage } from '../BasePage';
  
  export class CustomersPage extends BasePage {
    path              = '/#/manager';
    showCustomersBtn  = 'button[ng-click="showCust()"]';
    searchInput       = 'input[ng-model="searchCustomer"]';
    tableRowsSelector = 'table tbody tr.ng-scope';
    tableRowsSel      = 'table tbody tr.ng-scope';

    private cellFn = (idx: number) => `table tbody tr:nth-child(${idx}) td:nth-child(1)`;
    private cellLn = (idx: number) => `table tbody tr:nth-child(${idx}) td:nth-child(2)`;
    private cellPc = (idx: number) => `table tbody tr:nth-child(${idx}) td:nth-child(3)`;
    private cellAc = (i: number) => `table tbody tr:nth-child(${i}) td:nth-child(4)`;

    private deleteBtn = (idx: number) => `table tbody tr:nth-child(${idx}) button`;
    private cellAccounts  = (idx: number) => `table tbody tr:nth-child(${idx}) td:nth-child(4)`;

    async openAndVerify(): Promise<void> {
      await click(this.showCustomersBtn);
      await waitForSelector(this.searchInput);
      await waitForSelector(this.tableRowsSelector);
    }
  
    async searchFor(text: string): Promise<void> {
      await type(this.searchInput, text);
      await waitForSelector(this.tableRowsSelector);
    }
  
    async rowCount(): Promise<number> {
      return count(this.tableRowsSelector);
    }
  
    async getVisibleRows(): Promise<
      Array<{ firstName: string; lastName: string; postCode: string }>
    > {
      const n = await this.rowCount();
      const results: Array<{
        firstName: string;
        lastName:  string;
        postCode:  string;
      }> = [];
  
      for (let i = 1; i <= n; i++) {
        const first = await getText(this.cellFn(i));
        const last  = await getText(this.cellLn(i));
        const post  = await getText(this.cellPc(i));
        results.push({ firstName: first, lastName: last, postCode: post });
      }
  
      return results;
    }
    async hasAccountForCustomer(
        firstName: string,
        lastName:  string,
        accountNo: string
    ): Promise<boolean> {
        await this.openAndVerify();

        const rows = await count(this.tableRowsSel);
        for (let i = 1; i <= rows; i++) {
        const fn = await getText(this.cellFn(i));
        const ln = await getText(this.cellLn(i));
        if (fn === firstName && ln === lastName) {
            const acText = await getText(this.cellAc(i));
            const acList = acText.split(/\s+/).filter(Boolean);
            return acList.includes(accountNo);
        }
        }
        return false;
    }
    async deleteRow(rowIndex: number): Promise<void> {
      const before = await this.rowCount();
      await click(this.deleteBtn(rowIndex));
      await waitForSelector(
        this.tableRowsSelector,
        5000
      );
      const after = await this.rowCount();
      if (after !== before - 1) {
        throw new Error(
          `Expected row count to drop from ${before} to ${before - 1}, but got ${after}`
        );
      }
    }
  }
