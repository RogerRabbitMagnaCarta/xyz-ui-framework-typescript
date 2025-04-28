// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL        = process.env.BASE_URL ?? '';
export const TEST_ENGINE     = process.env.TEST_ENGINE ?? 'playwright';
export const HEADLESS        = process.env.HEADLESS !== 'false';
export const SLOWMO          = Number(process.env.SLOWMO || 0);
export const SCREENSHOTS_DIR = process.env.SCREENSHOTS_DIR || 'screenshots';
