import axios from 'axios'
import { getListOfPublicHolidays } from './public-holidays.service'
import {
  PUBLIC_HOLIDAY_LIST_GB,
  SHORT_PUBLIC_HOLIDAY_LIST_GB,
} from '../tests/mock-data'
import * as helpers from '../helpers'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
jest.mock('../helpers')
const mockedHelpers = helpers as jest.Mocked<typeof helpers>

describe('getListOfPublicHolidays()', () => {
  const validYear = new Date().getFullYear()
  const validCountry = 'GB'

  beforeEach(() => {
    mockedHelpers.validateInput.mockReturnValue(true)
    mockedHelpers.shortenPublicHoliday.mockImplementation((holiday) => ({
      name: holiday.name,
      localName: holiday.localName,
      date: holiday.date,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('gets list of public holidays', async () => {
    mockedAxios.get.mockResolvedValue({ data: PUBLIC_HOLIDAY_LIST_GB })

    const listOfPublicHolidays = await getListOfPublicHolidays(
      validYear,
      validCountry
    )

    expect(listOfPublicHolidays).toStrictEqual(SHORT_PUBLIC_HOLIDAY_LIST_GB)
  })

  it('return an empty array when the error occurs', async () => {
    mockedAxios.get.mockRejectedValue(new Error())

    const listOfPublicHolidays = await getListOfPublicHolidays(
      validYear,
      validCountry
    )

    expect(listOfPublicHolidays).toStrictEqual([])
  })
})
