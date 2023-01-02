import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_3_hours.json'
import { Forecast, ForecastProcessinInternalError } from '../forecast';
import { Beach, BeachPosition } from '@src/models/beach';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints = jest.fn().mockResolvedValueOnce(stormGlassNormalizedResponseFixture)

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
      }
    ]

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            raiting: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100,
          }
        ]
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            raiting: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          }
        ]
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            raiting: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100,
          }
        ]
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWiyhRaiting = await forecast.processForecastForBeach(beaches);
    expect(beachesWiyhRaiting).toEqual(expectedResponse)
  });

  it('should return an empty list when beaches array is empty', async () => {
    const forecast = new Forecast(mockedStormGlassService);
    const response = await forecast.processForecastForBeach([])
    expect(response).toEqual([])
  });

  it('should throw internal processing error when something goes during the reiting process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
      }
    ]

    mockedStormGlassService.fetchPoints.mockRejectedValueOnce('Error fetching data')
    const forecast = new Forecast(mockedStormGlassService)
    await expect(forecast.processForecastForBeach(beaches)).rejects.toThrow(ForecastProcessinInternalError)
  });
});
