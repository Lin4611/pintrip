import { expect, test, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DeleteTripDialog } from './delete-trip-dialog'

function renderDialog(overrides: Partial<Parameters<typeof DeleteTripDialog>[0]> = {}) {
  return render(
    <DeleteTripDialog
      open
      tripId="tokyo"
      tripName="東京"
      placeCount={12}
      onCancel={() => {}}
      onConfirmDelete={() => {}}
      {...overrides}
    />,
  )
}

test('exposes the modal dialog contract and moves focus inside the sheet', async () => {
  renderDialog()

  const dialog = await screen.findByRole('dialog')

  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAccessibleName(/東京/)
  expect(dialog).toHaveAccessibleDescription(/12/)
  expect(dialog).toContainElement(document.activeElement as HTMLElement)
})

test('cancelling never triggers the delete callback', async () => {
  const user = userEvent.setup()
  const onCancel = vi.fn()
  const onConfirmDelete = vi.fn()
  renderDialog({ onCancel, onConfirmDelete })

  await user.click(await screen.findByRole('button', { name: '取消' }))

  expect(onCancel).toHaveBeenCalledTimes(1)
  expect(onConfirmDelete).not.toHaveBeenCalled()
})

test('confirming reports the trip id exactly once', async () => {
  const user = userEvent.setup()
  const onCancel = vi.fn()
  const onConfirmDelete = vi.fn()
  renderDialog({ onCancel, onConfirmDelete })

  await user.click(await screen.findByRole('button', { name: '刪除收藏' }))

  expect(onConfirmDelete).toHaveBeenCalledTimes(1)
  expect(onConfirmDelete).toHaveBeenCalledWith('tokyo')
})

test('states the full scope of impact before deleting', async () => {
  renderDialog({ placeCount: 28 })

  const dialog = await screen.findByRole('dialog')
  const inDialog = within(dialog)

  expect(inDialog.getByText('這個收藏的匯入紀錄與候選地點')).toBeInTheDocument()
  expect(inDialog.getByText('為這個收藏上傳的補充截圖')).toBeInTheDocument()
  expect(inDialog.getByText('已收藏的 28 個地點與它們的來源關聯')).toBeInTheDocument()
  expect(
    inDialog.getByText('其他收藏也在用的地點資料不會被刪除。'),
  ).toBeInTheDocument()
  expect(inDialog.getByText('刪除後無法復原。')).toBeInTheDocument()
})
