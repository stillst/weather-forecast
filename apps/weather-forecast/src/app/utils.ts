import { ForecastPeriod } from '@bp/weather-forecast/services';

export function castPeriodToForecastPeriod(val: string): ForecastPeriod {
	return ForecastPeriod[val as keyof typeof ForecastPeriod];
}
