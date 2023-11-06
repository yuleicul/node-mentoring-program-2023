import { shortenPublicHoliday, validateInput } from './helpers'
import { PublicHoliday } from './types'

describe('validateInput()', () => {
  const validYear = new Date().getFullYear()
  const validCountry = 'GB'
  const invalidYear = validYear - 1
  const invalidCountry = 'CN'

  it('returns true when year and country are both valid', () => {
    const result = validateInput({
      year: validYear,
      country: validCountry,
    })
    expect(result).toBe(true)
  })

  it('throws an error when year is valid but country is invalid', () => {
    const funcWrapper = () =>
      validateInput({
        year: validYear,
        country: invalidCountry,
      })
    expect(funcWrapper).toThrow(
      `Country provided is not supported, received: ${invalidCountry}`
    )
  })

  it('throws an error when country is valid but year is invalid', () => {
    const funcWrapper = () =>
      validateInput({
        year: invalidYear,
        country: validCountry,
      })
    expect(funcWrapper).toThrow(
      `Year provided not the current, received: ${invalidYear}`
    )
  })

  it('throws an error when country and year are both invalid', () => {
    const funcWrapper = () =>
      validateInput({
        year: invalidYear,
        country: invalidCountry,
      })
    expect(funcWrapper).toThrow(
      `Country provided is not supported, received: ${invalidCountry}`
    )
  })
})

describe('shortenPublicHoliday()', () => {
  it('shortens object correctly', () => {
    const DATE = '11/02/2023'
    const LOCAL_NAME = 'Lunar New Year'
    const NAME = 'New Year'
    const holiday: PublicHoliday = {
      date: DATE,
      localName: LOCAL_NAME,
      name: NAME,
      countryCode: 'CN',
      fixed: true,
      global: true,
      counties: null,
      launchYear: null,
      types: [],
    }

    const shortHoliday = shortenPublicHoliday(holiday)

    expect(shortHoliday).toHaveProperty('name')
    expect(shortHoliday.date).toBe(DATE)
    expect(shortHoliday).toHaveProperty('localName')
    expect(shortHoliday.localName).toBe(LOCAL_NAME)
    expect(shortHoliday).toHaveProperty('date')
    expect(shortHoliday.name).toBe(NAME)
    expect(shortHoliday).not.toHaveProperty('countryCode')
    expect(shortHoliday).not.toHaveProperty('fixed')
    expect(shortHoliday).not.toHaveProperty('global')
    expect(shortHoliday).not.toHaveProperty('counties')
    expect(shortHoliday).not.toHaveProperty('launchYear')
    expect(shortHoliday).not.toHaveProperty('types')
  })
})
