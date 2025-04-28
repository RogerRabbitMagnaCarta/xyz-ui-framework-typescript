// tests/login.spec.ts
import { launch, close, open, getText } from '../src/core/actions';

beforeAll(async () => { await launch(); });
afterAll(async () => { await close(); });

describe('Google Load', () => {
  it('loads google.com', async () => {
    await open('https://www.google.com');
    const title = await getText('title');
    expect(title.toLowerCase()).toContain('google');
  }, 30000);
});