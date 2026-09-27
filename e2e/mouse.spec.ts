import { test, expect } from '@playwright/test';

test('mouse hover, floating pace controls, docking, and dialogue',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.goto('/');await page.locator('#play').click();
 await page.locator('#pace-fast').click();await expect(page.locator('#pace-fast')).toHaveAttribute('aria-pressed','true');
 await page.locator('#pace-cruise').click();
 const controls=await page.locator('.pace-controls').boundingBox();expect(controls!.y).toBeGreaterThan(650);expect(controls!.x).toBeGreaterThan(500);
 await page.clock.runFor(15000);
 await page.mouse.move(385,250);await page.clock.runFor(32);
 await expect(page.locator('#river')).toHaveCSS('cursor','pointer');
 await page.screenshot({path:'test-results/animal-hover.png'});
 await page.mouse.click(385,250);await expect(page.locator('#toast')).toContainText('Heading to Rabbit');
 await page.clock.runFor(8000);
 await expect(page.locator('#dialog')).toBeVisible();await expect(page.locator('#dialog-title')).toHaveText('Rabbit');
 await page.locator('#accept').click();await expect(page.locator('#tasks')).toContainText('Picnic basket');
 await page.mouse.move(900,580);await page.clock.runFor(2000);await expect(page.locator('#prompt')).toBeHidden();
 await expect(page.locator('#river')).toHaveCSS('cursor','crosshair');
 await page.screenshot({path:'test-results/mouse-controls.png'});
 await page.locator('#pause-button').click();await expect(page.locator('#pause')).toBeVisible();
 await page.locator('#resume').click();await expect(page.locator('#pause')).toBeHidden();
 expect(errors).toEqual([]);
});
