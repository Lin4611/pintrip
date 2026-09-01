import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Vitest globals stay off, so Testing Library's automatic cleanup does not run.
afterEach(cleanup)
