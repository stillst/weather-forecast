import { ForecastPeriod } from '@bp/weather-forecast/services';

export interface CityForecast {
	time: string;
	temp: number;
}

export type CurrentForecast = Record<string, Array<CityForecast>>;

export type Forecast = Map<ForecastPeriod, CurrentForecast>;
