import { test, expect } from '@playwright/test'

test('admin can sign in and load dashboard', async ({ page }) => {
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/#/login')
  await page.getByLabel('البريد الإلكتروني').fill(process.env.ADMIN_EMAIL)
  await page.getByLabel('كلمة المرور').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click()
  await expect(page).toHaveURL(/#\/$/)
  await page.goto('/#/admin')
  await expect(page.getByRole('heading', { name: 'لوحة الإدارة' })).toBeVisible()
  expect(errors).toEqual([])
})
