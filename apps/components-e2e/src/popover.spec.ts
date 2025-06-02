import AxeBuilder from '@axe-core/playwright';
import { expect, Locator, test } from '@playwright/test';

test.describe('Popover', () => {
  async function expectPopoverToBeVisible(popover: Locator) {
    // Popover visible and present in DOM
    await expect(popover).toBeVisible();
    await expect(popover).toBeAttached();

    // Check that the popover now has the focus and animation associated attributes
    await expect(popover).toHaveAttribute('data-focus-trap');
    await expect(popover).toHaveAttribute('data-enter');
  }

  async function expectPopoverToBeHidden(popover: Locator) {
    // Popover neither visible nor present in DOM
    await expect(popover).not.toBeVisible();
    await expect(popover).not.toBeAttached();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/popover');
  });

  test('show and hide popover on Mouse CLICK', async ({ page }) => {
    // Access trigger and popover 
    const trigger = page.getByRole('button');
    const popover = page.getByRole('dialog');

    // Popover initially hidden
    await expect(trigger).not.toHaveAttribute('data-open');
    await expectPopoverToBeHidden(popover);

    // Trigger click
    await trigger.click();
    await expect(trigger).toHaveAttribute('data-open');
    await expectPopoverToBeVisible(popover);

    // Trigger click to hide popover
    await page.locator('body').click();
    await expect(trigger).not.toHaveAttribute('data-open');

    // Popover hidden again
    await expectPopoverToBeHidden(popover);
  });

  test('show and hide popover on Enter and Escape KEY PRESS', async ({ page }) => {
    // Access trigger and popover 
    const trigger = page.getByRole('button');
    const popover = page.getByRole('dialog');

    await expect(trigger).not.toHaveAttribute('data-focus-visible');

    await page.click('body') // Reset focus 

    // Move focus to trigger
    await page.keyboard.press('Tab');
    await expect(trigger).toHaveAttribute('data-focus-visible');
    await expect(trigger).not.toHaveAttribute('data-open');

    /**
     * Opening popover blurs trigger
     */
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('data-open');
    await expect(trigger).not.toHaveAttribute('data-focus-visible');
    await expectPopoverToBeVisible(popover); // Popover open

    /**
     * Closing popover focuses back to trigger
     */
    await page.keyboard.press('Escape');
    await expectPopoverToBeHidden(popover); // Popover close
    await expect(trigger).toHaveAttribute('data-focus-visible');
    await expect(trigger).not.toHaveAttribute('data-open');

    // Blur trigger: back to initial state
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).not.toHaveAttribute('data-focus-visible');

  })

  test('show and hide popover on Space and Escape KEY PRESS', async ({ page }) => {
    // Access trigger and popover 
    const trigger = page.getByRole('button');
    const popover = page.getByRole('dialog');

    await expect(trigger).not.toHaveAttribute('data-focus-visible');

    await page.click('body')

    // Move focus to trigger
    await page.keyboard.press('Tab');
    await expect(trigger).toHaveAttribute('data-focus-visible');
    await expect(trigger).not.toHaveAttribute('data-open');

    /**
     * Opening popover blurs trigger
     */
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('data-open');
    await expect(trigger).not.toHaveAttribute('data-focus-visible');
    await expectPopoverToBeVisible(popover); // Popover open

    /**
     * Closing popover focuses back to trigger
     */
    await page.keyboard.press('Escape');
    await expectPopoverToBeHidden(popover); // Popover close
    await expect(trigger).toHaveAttribute('data-focus-visible');
    await expect(trigger).not.toHaveAttribute('data-open');

    // Blur trigger: back to initial state
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).not.toHaveAttribute('data-focus-visible');

  })

  test('should have no detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['page-has-heading-one'])
      .analyze();
    expect(accessibilityScanResults.violations.length).toEqual(0);
  });
});
