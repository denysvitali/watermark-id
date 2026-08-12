import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { LOCALE_STORAGE_KEY } from './i18n'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'en'
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('initial privacy flow', () => {
  it('explains local processing and offers file and camera input', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /share your id/i })).toBeInTheDocument()
    expect(screen.getByText('On-device only')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose photo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Take photo' })).toBeInTheDocument()
    expect(screen.getByText('No uploads')).toBeInTheDocument()
    expect(screen.getByText('Works offline')).toBeInTheDocument()
    expect(screen.getByText('No tracking')).toBeInTheDocument()
  })

  it('rejects active image formats that could reference remote resources', async () => {
    const { container } = render(<App />)
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')
    const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" />'], 'id.svg', {
      type: 'image/svg+xml',
    })

    fireEvent.change(input!, { target: { files: [file] } })

    expect(await screen.findByRole('alert')).toHaveTextContent('Choose JPEG, PNG or WebP images.')
  })

  it('switches language immediately and remembers the user preference', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'de' },
    })

    expect(screen.getByRole('heading', { name: /teile deinen ausweis/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Sprache' })).toHaveValue('de')
    expect(document.documentElement).toHaveAttribute('lang', 'de')
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('de')
  })

  it('starts in the first supported language from browser preferences', () => {
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['pt-BR', 'fr-CA'])

    render(<App />)

    expect(screen.getByRole('heading', { name: /partagez votre pièce d’identité/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Langue' })).toHaveValue('fr')
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull()
  })
})
