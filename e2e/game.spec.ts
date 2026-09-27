import { test, expect } from '@playwright/test';
test('menu, steering, docking, acceptance, pause and replay',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.goto('/');await expect(page.locator('h1')).toContainText('A little raft.');await page.screenshot({path:'test-results/menu.png'});
 await page.locator('#play').click();await expect(page.locator('#hud')).toBeVisible();
 await page.clock.runFor(18000);await page.keyboard.down('ArrowLeft');await page.clock.runFor(1700);await page.keyboard.up('ArrowLeft');
 await expect(page.locator('#prompt')).toContainText('Rabbit');await page.keyboard.press('Space');await expect(page.locator('#dialog')).toBeVisible();await page.keyboard.press('Enter');await expect(page.locator('#tasks')).toContainText('Picnic basket');
 await page.screenshot({path:'test-results/game.png'});await page.keyboard.press('Escape');await expect(page.locator('#pause')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#pause')).toBeHidden();
 await page.clock.runFor(49500);await expect(page.locator('#prompt')).toContainText('Beaver');await page.keyboard.press('Space');await page.keyboard.press('Enter');await expect(page.locator('#task-count')).toHaveText('0 / 3');
 await page.keyboard.press('Escape');await page.locator('#quit').click();await page.locator('#play').click();await expect(page.locator('#task-count')).toHaveText('0 / 3');expect(errors).toEqual([]);
});
test('a full journey reaches results and can restart',async({page})=>{
 await page.clock.install();
 // Accelerate simulation timestamps while keeping real input and rendering paths.
 await page.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>raf(t=>callback(t*4))});
 await page.goto('/');await page.locator('#play').click();
 await page.clock.runFor(220000);await expect(page.locator('#results')).toBeVisible();await expect(page.locator('#final-score')).not.toBeEmpty();
 await page.screenshot({path:'test-results/results.png'});await page.locator('#again').click();await expect(page.locator('#score')).toHaveText('0');await expect(page.locator('#hearts')).toHaveText('♥♥♥');
});
