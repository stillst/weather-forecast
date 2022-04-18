import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherForecastApiService } from './weather-forecast-api.service';

@NgModule({
	imports: [HttpClientModule, CommonModule],
	providers: [WeatherForecastApiService],
})
export class WeatherForecastServicesModule {}
