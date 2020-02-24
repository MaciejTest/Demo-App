import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private APPID = '9eab232e6efb23b06a8f7a524adac65b';
  public weatherData = [];

  constructor(
    private http: HttpClient,
  ) { }


  getWeather(city, country) {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.APPID}&units=metric`;
    return this.http.get( weatherApi );
  }

  getWeatherHistorical(city, country, beginRange, endRange) {
    const weatherApi = `https://api.openweathermap.org/data/2.5/history?q=${city},${country}&type=hour&start=${beginRange}&end=${endRange}&APPID=${this.APPID}&units=metric`;
    return this.http.get( weatherApi );
  }

  getWeatherForecast(city, country) {
    const weatherApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&type=days&APPID=${this.APPID}&units=metric`;
    return this.http.get( weatherApi );
  }

  weatherForecastData(city, country) {
    return new Promise((resolve, reject) => {
        this.getWeatherForecast(city, country).subscribe(data => {
          data['list'].map((val) => {
            this.weatherData.push({
              time: val.dt_txt,
              temp: val.main.temp,
              feels_like: val.main.feels_like,
              temp_min: val.main.temp_min,
              temp_max: val.main.temp_max,
              pressure: val.main.pressure,
              humidity: val.main.humidity,
              wind: val.wind.deg,
              speed: val.wind.speed,
            });
            resolve(this.weatherData);
          });
        }, (error) => {
          reject(error);
        });
    });
  }
}
