import { test, expect } from '@playwright/test'

test('storefront loads without browser console errors', async ({ page }) => {
  const errors = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.filters input').first()).toBeVisible()
  await page.locator('.filters input').first().fill('test')
  await expect(page).toHaveURL(/search=test/)
  expect(errors).toEqual([])
})
