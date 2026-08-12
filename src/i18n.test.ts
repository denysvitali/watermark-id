import { describe, expect, it } from 'vitest'
import { resolveLocale, translate } from './i18n'

describe('localization', () => {
  it('uses the first supported browser preference, including regional variants', () => {
    expect(resolveLocale(['pt-BR', 'fr-CA', 'de-DE'])).toBe('fr')
  })

  it('uses a saved manual choice ahead of browser preferences', () => {
    expect(resolveLocale(['fr-FR'], 'it')).toBe('it')
  })

  it('ignores an invalid saved choice and returns to browser preferences', () => {
    expect(resolveLocale(['es-MX'], 'nl')).toBe('es')
  })

  it('falls back to English when no preferred language is supported', () => {
    expect(resolveLocale(['ja-JP', 'pt-BR'])).toBe('en')
  })

  it('interpolates values in translated messages', () => {
    expect(translate('es')('downloadBatch', { count: 3 })).toBe('Descargar lote (3)')
  })

  it('keeps source and license labels in every locale', () => {
    expect(translate('en')('viewSource')).toBe('View source')
    expect(translate('fr')('viewSourceAria')).toContain('GitHub')
    expect(translate('it')('mitLicense')).toContain('MIT')
    expect(translate('es')('heroLead')).toBe('Marca tu documento.')
    expect(translate('de')('heroAccent')).toBe('Nichts verlässt dieses Gerät.')
  })
})
