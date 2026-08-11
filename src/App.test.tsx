import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

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
})
