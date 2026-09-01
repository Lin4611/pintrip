import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'

// Setup smoke check: proves the JSX transform, the jsdom environment, Testing
// Library and the jest-dom matchers are wired up. It uses a local component so
// it does not depend on app code that the Home implementation will replace.
function Probe() {
  return <p>toolchain ok</p>
}

test('renders a component and applies jest-dom matchers', () => {
  render(<Probe />)

  expect(screen.getByText('toolchain ok')).toBeVisible()
})
