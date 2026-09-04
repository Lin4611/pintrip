import { expect, test } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TripCardMenu } from './trip-card-menu'

/**
 * 掛在 `data-scroll-container` 裡，與 `AppShell` 的真實 DOM 一致：選單靠它取得
 * 夾制邊界，捲動關閉也是由它發出事件——scroll 不冒泡，測試必須從這裡發才守得住
 * 元件的 capture 旗標（對 `document` 發等於直接命中目標，冒泡與否都會過）。
 */
function renderMenu(tripName = '東京') {
  const result = render(
    <div data-scroll-container>
      <TripCardMenu
        tripId="tokyo"
        tripName={tripName}
        onRename={() => {}}
        onDelete={() => {}}
      />
    </div>,
  )

  return { ...result, scroller: result.container.querySelector('[data-scroll-container]')! }
}

test('renders a more-options trigger labelled with the collection name', () => {
  renderMenu()

  const trigger = screen.getByRole('button', { name: '「東京」的更多選項' })

  expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('opens the menu and moves focus to its first item', async () => {
  const user = userEvent.setup()
  renderMenu()

  await user.click(screen.getByRole('button', { name: '「東京」的更多選項' }))

  const menu = await screen.findByRole('menu')
  expect(screen.getByRole('button', { name: '「東京」的更多選項' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  // 移焦是刻意排在 rAF（Radix 只在鍵盤開啟時自動移焦）。真實瀏覽器裡 rAF 在 paint 前
  // 就跑完，使用者看不到延遲；jsdom 的 rAF 是約 16ms 的計時器，同步斷言會與它搶。
  // `waitFor` 只改等待模型不放寬斷言——焦點沒落到第一列一樣會逾時失敗。
  await waitFor(() =>
    expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus(),
  )
})

test('closes on Escape and returns focus to the trigger', async () => {
  const user = userEvent.setup()
  renderMenu()

  const trigger = screen.getByRole('button', { name: '「東京」的更多選項' })
  await user.click(trigger)
  await screen.findByRole('menu')

  await user.keyboard('{Escape}')

  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

test('labels each menu item with the collection name', async () => {
  const user = userEvent.setup()
  renderMenu()

  await user.click(screen.getByRole('button', { name: '「東京」的更多選項' }))

  expect(
    await screen.findByRole('menuitem', { name: '重新命名旅行收藏：東京' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('menuitem', { name: '刪除旅行收藏：東京' }),
  ).toBeInTheDocument()
})

test('toggles closed when the same trigger is clicked again', async () => {
  const user = userEvent.setup()
  renderMenu()

  const trigger = screen.getByRole('button', { name: '「東京」的更多選項' })
  await user.click(trigger)
  await screen.findByRole('menu')

  await user.click(trigger)

  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('opening another card menu closes the first one in a single interaction', async () => {
  const user = userEvent.setup()
  render(
    <>
      <TripCardMenu
        tripId="tokyo"
        tripName="東京"
        onRename={() => {}}
        onDelete={() => {}}
      />
      <TripCardMenu
        tripId="kyoto"
        tripName="京都"
        onRename={() => {}}
        onDelete={() => {}}
      />
    </>,
  )

  await user.click(screen.getByRole('button', { name: '「東京」的更多選項' }))
  await screen.findByRole('menu')

  // One click on the other trigger — the outside-dismiss must not swallow it.
  await user.click(screen.getByRole('button', { name: '「京都」的更多選項' }))

  const menus = screen.getAllByRole('menu')
  expect(menus).toHaveLength(1)
  expect(
    screen.getByRole('button', { name: '「東京」的更多選項' }),
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: '「京都」的更多選項' }),
  ).toHaveAttribute('aria-expanded', 'true')
  // 同樣是 rAF 移焦，理由見上。
  await waitFor(() =>
    expect(within(menus[0]).getAllByRole('menuitem')[0]).toHaveFocus(),
  )
})

test('closes when the list scrolls and returns focus to the trigger', async () => {
  const user = userEvent.setup()
  const { scroller } = renderMenu()

  const trigger = screen.getByRole('button', { name: '「東京」的更多選項' })
  await user.click(trigger)
  await screen.findByRole('menu')

  // 捲動關閉是 CARD MENU §關閉條件的第四項。理由不只是體驗：向上翻轉的方向是
  // 在開啟當下量測的，捲動後該量測即過期，選單可能翻錯邊或被 BottomNav 蓋住。
  // 事件從**內層捲動容器**發出（真實情境），scroll 不冒泡，因此只有 capture 階段
  // 的監聽接得到——換成非 capture 這條就會紅。
  fireEvent.scroll(scroller)

  await waitFor(() =>
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
  )
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(trigger).toHaveFocus()
})
