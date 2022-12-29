import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(private readonly stormGlass: StormGlass) {}
  // constructor(protected stormGlass = new StormGlass()) {}
  async processForecastForBeach(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources = [];

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData: BeachForecast[] = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          raiting: 1
        },
        ...e
      }))
      pointsWithCorrectSources.push(...enrichedBeachData)
    }
    return this.mapForecastByTime(pointsWithCorrectSources);
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point);
      }
      forecastByTime.push({
        time: point.time,
        forecast: [point]
      })
    }
    return forecastByTime;
  }
}
