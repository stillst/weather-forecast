import { Component, OnDestroy } from '@angular/core';
import { map, Observable, Subject, Subscription, switchMap } from 'rxjs';
import { CITY_NOT_FOUND, ForecastPeriod, REQUEST_ERROR } from '@bp/weather-forecast/services';

import { WeatherForecastStoreService } from './store/weather-forecast-store.service';
import { CityForecast, CurrentForecast } from './store/interface';
import { FilterValue } from './components/app-table-filters/interface';
import { QueryParamsHandleService } from './services/query-params-handle.service';
import { castPeriodToForecastPeriod } from './utils';
import { NotificationService } from './services/notification.service';

@Component({
	selector: 'bp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
	title = 'weather-forecast';

	tableHeader$: Observable<string[]> = this.store.forecast$.pipe(
		map(forecast => this.getTableHeaderFromForecast(forecast))
	);

	tableBody$: Observable<(string | number)[][]> = this.store.forecast$.pipe(
		map(forecast => this.getTableBodyFromForecast(forecast))
	);

	forecastPeriod = Object.entries(ForecastPeriod).map(([_, value]) => value);

	private subscription: Subscription = new Subscription();
	private weatherForecastApiCall$: Subject<FilterValue> = new Subject();

	constructor(
		public store: WeatherForecastStoreService,
		private queryService: QueryParamsHandleService,
		private notificationService: NotificationService
	) {
		this.subscription.add(
			this.weatherForecastApiCall$
				.pipe(
					switchMap(({ text, select }) => store.getWeatherForecast(text, castPeriodToForecastPeriod(select)))
				)
				.subscribe((response: string | CityForecast[]) => {
					if (response === CITY_NOT_FOUND) {
						notificationService.notifyAboutError('city not found');
					} else if (response === REQUEST_ERROR) {
						notificationService.notifyAboutError('network error');
					}
				})
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	onSubmit(filterValue: FilterValue): void {
		this.queryService.updateQueryParam('city', filterValue.text);
		this.weatherForecastApiCall$.next(filterValue);
	}

	onSelectChanged(selectVal: string): void {
		this.queryService.updateQueryParam('period', selectVal);
		this.store.updateForecastPeriod(castPeriodToForecastPeriod(selectVal));
	}

	onFormError(): void {
		this.notificationService.notifyAboutError('form error');
	}

	getTableHeaderFromForecast(forecast: CurrentForecast): string[] {
		const head = Object.values(forecast)[0];
		return head ? ['City Name', ...head.map((forecast: CityForecast) => forecast.time)] : [''];
	}

	getTableBodyFromForecast(forecast: CurrentForecast): (string | number)[][] {
		return Object.entries(forecast).map(([city, temp]) => [
			city,
			...temp.map((forecast: CityForecast) => forecast.temp),
		]);
	}
}
