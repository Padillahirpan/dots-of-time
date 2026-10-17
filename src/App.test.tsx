import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the brand and the four scale tabs', () => {
    render(<App />)
    expect(screen.getAllByText('Dots of Time').length).toBeGreaterThanOrEqual(1)
    // desktop nav and mobile row both render, toggled by breakpoints
    for (const name of ['Day', 'Week', 'Month', 'Year']) {
      expect(screen.getAllByRole('tab', { name }).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('shows the day view with percent, hour dots, and dimensions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Daily Dimensions' })).toBeTruthy()
    expect(screen.getByText(/\d+\.\d%/)).toBeTruthy()
    expect(screen.getAllByRole('img', { name: /\d{2}:00/ }).length).toBe(24)
    expect(screen.getByText('Career')).toBeTruthy()
    expect(screen.getByText('Life & Vitality')).toBeTruthy()
    expect(screen.getByText('Money')).toBeTruthy()
  })
})
