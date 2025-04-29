import 'dotenv/config';
import { launch, close } from './core/actions';

async function main() {
  await launch();
  try {
    const jest = require('jest');
    const args = process.argv.slice(2);
    await jest.run(args);
  } finally {
    await close();
  }
}

main().catch(err => {
  console.error('Runner crashed:', err);
  process.exit(1);
});
