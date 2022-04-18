import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { City, DailyForecast, DailyForecastResponse, HourlyForecast, HourlyForecastResponse } from './interface';
import { CITY_NOT_FOUND, REQUEST_ERROR } from './const';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	private _apiKey = '010721642521f31b0fbc8c3831d45951';

	constructor(private http: HttpClient) {}

	getCityCoordinates(city: string): Observable<City | string> {
		return this.http
			.get<City[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this._apiKey}`)
			.pipe(
				map((cities: City[]) => cities[0] || CITY_NOT_FOUND),
				catchError(() => of(REQUEST_ERROR))
			);
	}

	getHourlyForecast(lat: number, lon: number): Observable<HourlyForecast[] | string> {
		return this.http
			.get<HourlyForecastResponse>(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this._apiKey}&units=metric`
		).pipe(
			map(forecast => forecast.hourly),
			catchError(() => of(REQUEST_ERROR))
		);
	}

	getDailyForecast(lat: number, lon: number): Observable<DailyForecast[] | string> {
		return this.http
			.get<DailyForecastResponse>(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this._apiKey}&units=metric`
		).pipe(
			map(forecast => forecast.daily),
			catchError(() => of(REQUEST_ERROR))
		);
	}
}
