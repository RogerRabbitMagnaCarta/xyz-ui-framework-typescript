import { click, getText } from '../../core/actions';

export class Header {
  private readonly homeBtn    = 'button:has-text("Home")';
  private readonly titleSel   = 'header h1';
  private readonly logoutBtn  = 'button:has-text("Logout")';

  async getTitle(): Promise<string> {
    return getText(this.titleSel);
  }

  async clickHome(): Promise<void> {
    await click(this.homeBtn);
  }

  async isLogoutVisible(): Promise<boolean> {
    try {
      await getText(this.logoutBtn);
      return true;
    } catch {
      return false;
    }
  }

  async clickLogout(): Promise<void> {
    if (await this.isLogoutVisible()) {
      await click(this.logoutBtn);
    }
  }
}