import { test, expect } from '@playwright/test';

test('bamboo collects on contact, pauses its timer, and expires', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.goto('/');
  await page.locator('#play').click();
  await expect(page.locator('#boost')).toBeHidden();
  await page.clock.runFor(40000);
  await expect(page.locator('#boost')).toBeVisible();
  await expect(page.locator('#boost')).toContainText('+50% speed');
  await page.keyboard.press('Escape');
  const paused = await page.locator('#boost').textContent();
  await page.clock.runFor(5000);
  await expect(page.locator('#boost')).toHaveText(paused!);
  await page.keyboard.press('Escape');
  await page.screenshot({path:'test-results/bamboo-boost.png'});
  await page.clock.runFor(35000);
  await expect(page.locator('#boost')).toBeHidden();
  expect(errors).toEqual([]);
});
