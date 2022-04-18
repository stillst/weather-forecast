import { Injectable } from '@angular/core';

import {
	City,
	CITY_NOT_FOUND,
	DailyForecast,
	ForecastPeriod,
	HourlyForecast,
	WeatherForecastApiService,
} from '@bp/weather-forecast/services';
import { BehaviorSubject, map, tap, Observable, merge, filter, switchMap, combineLatest, of } from 'rxjs';

import { QueryParamsHandleService } from '../services/query-params-handle.service';
import { castPeriodToForecastPeriod } from '../utils';
import { CityForecast, CurrentForecast, Forecast } from './interface';

@Injectable({ providedIn: 'root' })
export class WeatherForecastStoreService {
	forecastPeriod$: Observable<string>;
	forecastCity$: Observable<string>;
	forecast$: Observable<CurrentForecast>;

	private _forecastPeriod$: BehaviorSubject<string> = new BehaviorSubject('');
	private _forecastCity$: BehaviorSubject<string> = new BehaviorSubject('');

	private _apiMap = new Map([
		[ForecastPeriod.daily, this.getDailyTemperature],
		[ForecastPeriod.hourly, this.getHourlyTemperature],
	]);

	private _forecast$: BehaviorSubject<Forecast> = new BehaviorSubject<Forecast>(
		new Map([
			[ForecastPeriod.daily, {}],
			[ForecastPeriod.hourly, {}],
		])
	);

	constructor(
		private weatherForecastApiService: WeatherForecastApiService,
		private queryService: QueryParamsHandleService
	) {
		this.forecastCity$ = merge(
			this._forecastCity$.asObservable(),
			this.queryService.getQueryParamStream('city')
		).pipe(filter(Boolean));

		this.forecastPeriod$ = merge(
			this._forecastPeriod$.asObservable(),
			this.queryService.getQueryParamStream('period')
		).pipe(filter(Boolean));

		this.forecast$ = combineLatest([this._forecast$.asObservable(), this.forecastPeriod$]).pipe(
			map(([forecast, period]) => forecast.get(castPeriodToForecastPeriod(period))),
			filter(Boolean)
		);
	}

	getWeatherForecast(cityName: string, period: ForecastPeriod): Observable<string | CityForecast[]> {
		return this.weatherForecastApiService.getCityCoordinates(cityName).pipe(
			switchMap((city: City | string) => {
				const apiFun = this._apiMap.get(period)?.bind(this);
				if (!this.isCorrectResponse<City>(city) || !apiFun) {
					return of(CITY_NOT_FOUND);
				}

				return apiFun(city.lat, city.lon);
			}),
			tap((forecast: string | CityForecast[]) => {
				if (this.isCorrectResponse<CityForecast[]>(forecast)) {
					this.updateForecast(cityName, period, forecast);
				}
			})
		);
	}

	updateForecastPeriod(period: ForecastPeriod): void {
		this._forecastPeriod$.next(period);
	}

	private getDailyTemperature(lat: number, lon: number): Observable<CityForecast[] | string> {
		return this.weatherForecastApiService
			.getDailyForecast(lat, lon)
			.pipe(
				map((forecast: DailyForecast[] | string) =>
					this.isCorrectResponse<DailyForecast[]>(forecast) ? this.formatDailyTemperature(forecast) : forecast
				)
			);
	}

	private getHourlyTemperature(lat: number, lon: number): Observable<CityForecast[] | string> {
		return this.weatherForecastApiService
			.getHourlyForecast(lat, lon)
			.pipe(
				map((forecast: HourlyForecast[] | string) =>
					this.isCorrectResponse<HourlyForecast[]>(forecast) ? this.formatHourlyTemperature(forecast) : forecast
				)
			);
	}

	private formatDailyTemperature(forecast: DailyForecast[]): CityForecast[] {
		const now = new Date();
		return forecast
			.map((dailyForecast: DailyForecast, i: number) => {
				const date = new Date().setDate(now.getDate() + i);
				return {
					time: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
					temp: dailyForecast.temp.day,
				};
			})
			.slice(0, -1);
	}

	private formatHourlyTemperature(forecast: HourlyForecast[]): CityForecast[] {
		const now = new Date();
		const step = 3;
		return forecast
			.filter((_, i) => i % step === 0)
			.slice(0, -8)
			.map((hourlyWeather: HourlyForecast, i: number) => {
				const date = new Date(new Date().setHours(now.getHours() + i * step));
				return {
					time: `${date.getHours()}:00`,
					temp: hourlyWeather.temp,
				};
			});
	}

	private updateForecast(cityName: string, period: string, temp: CityForecast[]): void {
		const forecast = this._forecast$.getValue();
		const periodForecast = forecast.get(ForecastPeriod[period as keyof typeof ForecastPeriod]);
		if (periodForecast) {
			periodForecast[cityName] = temp;
			this._forecast$.next(new Map([...forecast, [castPeriodToForecastPeriod(period), periodForecast]]));
		}
	}

	private isCorrectResponse<T>(response: string | T): response is T {
		return typeof response !== 'string';
	}
}
