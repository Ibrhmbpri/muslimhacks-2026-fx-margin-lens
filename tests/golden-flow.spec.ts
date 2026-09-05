import { expect, test } from '@playwright/test'

test('protects the complete judge golden flow', async ({ page }, testInfo) => {
  await page.route('**/valet/**', (route) => route.abort())
  await page.goto('/')

  await expect(page).toHaveTitle(/FX Margin Lens/)
  await expect(page.getByRole('heading', { name: 'Start with the deal' })).toBeVisible()
  await expect(page.getByText('Editable demo', { exact: true })).toBeVisible()

  await expect(page.getByLabel('Supplier invoice')).toHaveValue('20000')
  await expect(page.getByLabel('Expected customer revenue')).toHaveValue('33000')
  await expect(page.getByLabel('Other known order costs')).toHaveValue('1000')
  await expect(page.getByLabel('Target profit margin')).toHaveValue('12')
  await expect(page.getByLabel('Reference USD/CAD')).toHaveValue('1.35')

  await page.getByRole('button', { name: 'Use Bank of Canada' }).click()
  await expect(page.getByRole('status')).toContainText('Reference rate unavailable. Your manual rate still works.')
  await page.getByLabel('Reference USD/CAD').fill('1.36')
  await expect(page.getByLabel('Reference USD/CAD')).toHaveValue('1.36')
  await page.getByLabel('Reference USD/CAD').fill('1.35')

  const optionNames = page.getByRole('textbox', { name: 'Option name' })
  const bankCard = optionNames.nth(0).locator('xpath=ancestor::article')
  const specialistCard = optionNames.nth(1).locator('xpath=ancestor::article')
  await expect(bankCard).toBeVisible()
  await expect(specialistCard).toBeVisible()
  await expect(bankCard.getByText('$27,800.00', { exact: true })).toBeVisible()
  await expect(bankCard.getByText('$830.00', { exact: true })).toBeVisible()
  await expect(bankCard.getByText('$4,170.00', { exact: true })).toBeVisible()
  await expect(bankCard.getByText('12.64%', { exact: true })).toBeVisible()
  await expect(specialistCard.getByText('$27,500.00', { exact: true })).toBeVisible()
  await expect(specialistCard.getByText('$520.00', { exact: true })).toBeVisible()
  await expect(specialistCard.getByText('$4,480.00', { exact: true })).toBeVisible()
  await expect(specialistCard.getByText('13.58%', { exact: true })).toBeVisible()

  await bankCard.getByRole('button', { name: 'Analyze this option' }).click()
  await expect(bankCard.getByRole('button', { name: 'Selected for scenario' })).toBeVisible()
  await expect(page.getByText('Canadian Bank', { exact: true }).last()).toBeVisible()
  await specialistCard.getByRole('button', { name: 'Analyze this option' }).click()
  await expect(specialistCard.getByRole('button', { name: 'Selected for scenario' })).toBeVisible()

  const scenarioRate = page.getByLabel('Scenario rate')
  const safeBidSection = page.getByRole('heading', { name: 'Safe selling price' }).locator('xpath=ancestor::section')
  await scenarioRate.fill('1.39')
  await expect(page.getByText('✓ Above target', { exact: true })).toBeVisible()
  await expect(page.getByText('$27,800.00', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('$4,180.00', { exact: true })).toBeVisible()
  await expect(page.getByText('12.67%', { exact: true })).toBeVisible()
  await expect(safeBidSection.getByText('$32,750.00', { exact: true }).first()).toBeVisible()

  await scenarioRate.fill('1.41')
  await expect(page.getByText('↓ Below target', { exact: true })).toBeVisible()
  await expect(page.getByText('$3,780.00', { exact: true })).toBeVisible()
  await expect(page.getByText('11.45%', { exact: true })).toBeVisible()
  await expect(safeBidSection.getByText('$33,204.55', { exact: true }).first()).toBeVisible()

  await expect(page.getByText('Scenario analysis — not an exchange-rate prediction.', { exact: true })).toBeVisible()
  const decisionLens = page.getByRole('heading', { name: 'What this means' }).locator('xpath=ancestor::section')
  await expect(decisionLens).toBeVisible()
  await expect(decisionLens.locator('li')).toHaveCount(6)
  await expect(page.getByText('Intermediary or receiving-bank fees', { exact: true })).toHaveCount(2)
  await expect(page.getByText('UNKNOWN', { exact: true })).toHaveCount(3)
  await expect(page.getByRole('heading', { name: 'What the numbers know' })).toBeVisible()
  await expect(page.getByText('KNOWN', { exact: true })).toBeVisible()
  await expect(page.getByText('ESTIMATED', { exact: true })).toBeVisible()

  const shariaSection = page.getByRole('heading', { name: 'A Sharia-aware lens' }).locator('xpath=ancestor::aside')
  await expect(shariaSection.getByText('A. Spot currency exchange', { exact: true })).toBeVisible()
  await expect(shariaSection.getByText('B. Natural / operational hedging', { exact: true })).toBeVisible()
  await expect(shariaSection.getByText('C. Supplier and payment-term planning', { exact: true })).toBeVisible()
  await expect(shariaSection.getByRole('link', { name: /AAOIFI SS \(1\) — Trading in Currencies/ })).toBeVisible()

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth, `${testInfo.project.name} layout has horizontal overflow`).toBe(viewport.clientWidth)
})

test('surfaces invalid payment option fields and recovers immediately', async ({ page }) => {
  await page.goto('/')

  const bankCard = page.getByRole('textbox', { name: 'Option name' }).nth(0).locator('xpath=ancestor::article')
  const quotedRate = bankCard.getByLabel('Quoted USD/CAD rate')
  const knownFee = bankCard.getByLabel('Known transfer fee')

  for (const invalidRate of ['0', '-1']) {
    await quotedRate.fill(invalidRate)
    await expect(quotedRate).toHaveAttribute('aria-invalid', 'true')
    await expect(quotedRate.locator('xpath=..')).toHaveClass(/input-error/)
    await expect(bankCard.getByText('Enter a CAD-per-USD rate greater than zero.', { exact: true })).toBeVisible()
    await expect(bankCard.getByText('Supplier conversion', { exact: true })).toHaveCount(0)
  }

  await quotedRate.fill('1.39')
  await expect(quotedRate).toHaveAttribute('aria-invalid', 'false')
  await expect(bankCard.getByText('Enter a CAD-per-USD rate greater than zero.', { exact: true })).toHaveCount(0)
  await expect(bankCard.getByText('$27,800.00', { exact: true })).toBeVisible()

  await knownFee.fill('-1')
  await expect(knownFee).toHaveAttribute('aria-invalid', 'true')
  await expect(knownFee.locator('xpath=..')).toHaveClass(/input-error/)
  await expect(bankCard.getByText('Known fees cannot be negative.', { exact: true })).toBeVisible()
  await expect(bankCard.getByText('Supplier conversion', { exact: true })).toHaveCount(0)
  await expect(bankCard).not.toContainText(/NaN|Infinity|undefined/)

  await knownFee.fill('30')
  await expect(knownFee).toHaveAttribute('aria-invalid', 'false')
  await expect(bankCard.getByText('Known fees cannot be negative.', { exact: true })).toHaveCount(0)
  await expect(bankCard.getByText('$4,170.00', { exact: true })).toBeVisible()
})
