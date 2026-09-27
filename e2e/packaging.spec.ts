import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

for (const delivery of ['direct file', 'static subfolder'] as const) {
  test(`standalone game works from ${delivery}`, async ({ page }) => {
    const errors: string[] = [];
    const dependencies: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.resourceType() !== 'document') dependencies.push(request.url());
    });
    if (delivery === 'direct file') {
      await page.goto(pathToFileURL(resolve('index.html')).href);
    } else {
      const html = await readFile('dist/index.html', 'utf8');
      await page.route('https://rafting.test/**', route =>
        route.fulfill({ contentType: 'text/html', body: html }));
      await page.goto('https://rafting.test/games/red-panda/index.html');
    }
    await expect(page.locator('#river')).toHaveCSS('position', 'absolute');
    await expect.poll(() => page.locator('#river').evaluate((canvas: HTMLCanvasElement) => {
      const data = canvas.getContext('2d')!.getImageData(0, 0, 1, 1).data;
      return data[3];
    })).toBe(255);
    await page.locator('#play').click();
    await expect(page.locator('#hud')).toBeVisible();
    await expect(page.locator('#menu')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.locator('#pause')).toBeVisible();
    await page.screenshot({ path: `test-results/standalone-${delivery.replace(' ', '-')}.png` });
    expect(errors).toEqual([]);
    expect(dependencies).toEqual([]);
  });
}
