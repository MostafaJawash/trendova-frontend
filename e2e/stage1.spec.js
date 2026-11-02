import { test, expect } from '@playwright/test'

const uniqueEmail = () => `stage1-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`

test('stage 1 auth flow has no logged-out API noise', async ({ page }) => {
  const consoleErrors = []
  const failedRequests = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('requestfailed', (request) => failedRequests.push(request.url()))

  await page.goto('/#/')
  await expect(page).toHaveURL(/#\/login\?next=/)
  await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible()
  expect(consoleErrors).toEqual([])
  expect(failedRequests).toEqual([])

  await page.getByRole('link', { name: 'حساب جديد' }).click()
  const email = uniqueEmail()
  await page.getByLabel('الاسم').fill('Stage One User')
  await page.getByLabel('البريد الإلكتروني').fill(email)
  await page.getByLabel('كلمة المرور', { exact: true }).fill('password123')
  await page.getByLabel('تأكيد كلمة المرور').fill('password123')
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByRole('heading', { name: /مرحباً بك/ })).toBeVisible()

  await page.getByRole('button', { name: 'تسجيل الخروج' }).click()
  await expect(page).toHaveURL(/#\/login\?next=/)

  await page.getByLabel('البريد الإلكتروني').fill(email)
  await page.getByLabel('كلمة المرور').fill('wrong-password')
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click()
  await expect(page.locator('.form-error')).toBeVisible()

  await page.getByLabel('كلمة المرور').fill('password123')
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click()
  await expect(page).toHaveURL(/#\/$/)
})
