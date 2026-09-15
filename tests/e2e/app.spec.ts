import { expect, test } from '@playwright/test';

test('создаёт черновик и переключает модули', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('tab', { name: 'Замечания' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Новое замечание' }).click();
  await expect(page.getByText(/РКС-000001/)).toBeVisible();
  await page.getByRole('button', { name: 'Назад в журнал' }).click();
  await page.getByRole('tab', { name: 'Фотоотчёт' }).click();
  await expect(page.getByRole('button', { name: 'Новый фотоотчёт' })).toBeVisible();
});
