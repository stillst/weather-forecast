export interface City {
	country: string;
	lat: number;
	local_names: { [key: string]: string };
	lon: number;
	name: string;
	state: string;
}

export interface DailyForecast {
	clouds: number;
	dew_point: number;
	dt: number;
	feels_like: { [key: string]: number };
	humidity: number;
	moon_phase: number;
	moonrise: number;
	moonset: number;
	pop: number;
	pressure: number;
	rain: number;
	sunrise: number;
	sunset: number;
	temp: { [key: string]: number };
	uvi: number;
	weather: WeatherDescription;
	wind_deg: number;
	wind_gust: number;
	wind_speed: number;
}


export interface HourlyForecast {
	clouds: number;
	dew_point: number;
	dt: number;
	feels_like: number;
	humidity: number;
	pop: number;
	pressure: number;
	temp: number;
	uvi: number;
	visibility: number;
	weather: WeatherDescription;
	wind_deg: number;
	wind_gust: number;
	wind_speed: number;
}

export interface HourlyForecastResponse {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: string;
	hourly: HourlyForecast[];
}

export interface DailyForecastResponse {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: string;
	daily: DailyForecast[];
}

interface WeatherDescription { id: number; main: string; description: string; icon: string };
