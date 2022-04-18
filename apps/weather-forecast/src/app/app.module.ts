import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { WeatherForecastServicesModule } from '@bp/weather-forecast/services';

import { AppComponent } from './app.component';
import { AppTableComponent } from './components/app-table/app-table.component';
import { AppTableFiltersComponent } from './components/app-table-filters/app-table-filters.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [AppComponent, AppTableComponent, AppTableFiltersComponent],
	imports: [
		ReactiveFormsModule,
		BrowserModule,
		WeatherForecastServicesModule,
		RouterModule.forRoot([]),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
