import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TripForm } from './trip-form'
import { AppHeader } from './app-header'

vi.mock('next/navigation', () => ({ useRouter: () => ({ back: () => {} }) }))

test('1: disables submission when the collection name is empty', () => {
  render(<TripForm />)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('2: keeps submission disabled for a whitespace-only name', async () => {
  const user = userEvent.setup()
  render(<TripForm />)
  await user.type(screen.getAllByRole('textbox')[0], '   ')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('3: explains disabled submission through an associated status hint', () => {
  render(<TripForm />)
  const hint = screen.getByRole('status')
  expect(hint).toHaveTextContent('先填收藏名稱，才能建立。')
  expect(hint.id).not.toBe('')
  expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', hint.id)
})

test('4: enables submission and removes the hint when the name has text', async () => {
  const user = userEvent.setup()
  render(<TripForm />)
  await user.type(screen.getAllByRole('textbox')[0], '京都')
  expect(screen.getByRole('button')).toBeEnabled()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
})

test('5: clearing the name preserves destination and description', async () => {
  const user = userEvent.setup()
  render(<TripForm />)
  const name = screen.getAllByRole('textbox')[0]
  await user.type(name, '京都')
  const destination = screen.getByPlaceholderText('例如：日本 京都')
  const note = screen.getByPlaceholderText('這趟旅行想留下什麼？主題或感受都可以。')
  await user.type(destination, '日本 京都')
  await user.type(note, '秋天散步')
  await user.clear(name)
  expect(destination).toHaveValue('日本 京都')
  expect(note).toHaveValue('秋天散步')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('6: Enter submits a trimmed name and cannot submit an empty name', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<TripForm onSubmit={onSubmit} />)
  const name = screen.getAllByRole('textbox')[0]
  await user.click(name)
  await user.keyboard('{Enter}')
  expect(onSubmit).not.toHaveBeenCalled()
  await user.type(name, '  京都的秋天  {Enter}')
  expect(onSubmit).toHaveBeenCalledWith({ name: '京都的秋天', destination: '', note: '' })
})

test('7: create shows its title, action and three empty fields', () => {
  render(<TripForm mode="create" />)
  expect(screen.getByRole('heading', { name: '建立旅行收藏' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '建立收藏' })).toBeDisabled()
  expect(screen.getAllByRole('textbox')).toHaveLength(3)
  for (const field of screen.getAllByRole('textbox')) expect(field).toHaveValue('')
})

test('8: edit prefills all fields and allows saving immediately', () => {
  render(<TripForm mode="edit" initialValues={{ name: '東京', destination: '日本', note: '東京的老派風景與新的日常交會。' }} />)
  expect(screen.getByRole('heading', { name: '編輯旅行收藏' })).toBeInTheDocument()
  expect(screen.getByDisplayValue('東京')).toBeInTheDocument()
  expect(screen.getByDisplayValue('日本')).toBeInTheDocument()
  expect(screen.getByDisplayValue('東京的老派風景與新的日常交會。')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '儲存變更' })).toBeEnabled()
})

test('9: each field has an associated visible label', () => {
  render(<TripForm />)
  expect(screen.getByLabelText('收藏名稱')).toHaveRole('textbox')
  expect(screen.getByLabelText('目的地名稱')).toHaveRole('textbox')
  expect(screen.getByLabelText('收藏說明')).toHaveRole('textbox')
})

test('10: only the collection name is announced as required', () => {
  render(<TripForm />)
  expect(screen.getByLabelText('收藏名稱')).toHaveAttribute('aria-required', 'true')
  expect(screen.getByLabelText('目的地名稱')).not.toHaveAttribute('aria-required')
  expect(screen.getByLabelText('收藏說明')).not.toHaveAttribute('aria-required')
})

test('11: the back control has a Traditional Chinese accessible name', () => {
  render(<AppHeader />)
  expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
})
