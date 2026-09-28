import { expect, test } from '@playwright/test'

test('opens orders and shows details', async ({ page }) => {
  await page.goto('/orders')
  await expect(page.getByRole('heading', { name: /Orders|Приходы/ })).toBeVisible()
  await page.locator('[data-testid="order-row"]').first().click()
  await expect(page.locator('[data-testid="order-details"]')).toBeVisible()
})

test('filters products by type', async ({ page }) => {
  await page.goto('/products')
  const select = page.getByLabel(/Type|Тип/)
  await expect(select).toBeVisible()
  const options = await select.locator('option').count()
  expect(options).toBeGreaterThan(1)
  await select.selectOption({ index: 1 })
  await expect(page.locator('[data-testid="product-row"]').first()).toBeVisible()
})
