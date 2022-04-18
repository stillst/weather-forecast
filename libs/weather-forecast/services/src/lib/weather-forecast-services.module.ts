import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { WeatherForecastApiService } from './weather-forecast-api.service';

@NgModule({
	imports: [HttpClientModule, CommonModule, BrowserModule],
	providers: [WeatherForecastApiService],
})
export class WeatherForecastServicesModule {}
