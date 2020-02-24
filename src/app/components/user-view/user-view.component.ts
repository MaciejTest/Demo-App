import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@/services/authentication.service';
import { WeatherService } from '@/services/weather.service';
import { UsersService } from '@/services/users.service';
import { PdfService } from '@/services/pdf.service';
import moment from 'moment';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  public weatherTime;
  public user;
  public cols: any[];
  public weatherData;

  constructor(
    public weatherService: WeatherService,
    public pdfService: PdfService,
    public usersService: UsersService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = this.authenticationService.currentUserValue;
    this.weatherTime = moment().format('YYYY/MM/DD HH:mm:ss');

    this.cols = [
      { field: 'time', header: 'Czas' },
      { field: 'temp', header: `Temp. [${String.fromCharCode(176)}C]` },
      { field: 'feels_like', header: `Temp. Odcz. [${String.fromCharCode(176)}C]` },
      { field: 'temp_min', header: `Temp. [MIN  ${String.fromCharCode(176)}C]` },
      { field: 'temp_max', header: `Temp. [MAX  ${String.fromCharCode(176)}C]` },
      { field: 'pressure', header: 'Ciśnienie [hPa]' },
      { field: 'humidity', header: 'Wilgotność [%]' },
      { field: 'wind', header: `Kier. wiatru  [${String.fromCharCode(176)}]` },
      { field: 'speed', header: 'Pręd. wiatru [km/h]' }
    ];

    if (this.user.city !== '' && this.user.city !== '') {
        this.weatherService.getWeather(this.user.city, this.user.country).subscribe(data => {
          this.user.humidity = data['main'].humidity;
          this.user.temp = data['main'].temp;
        }, (error) => {
          this.user.humidity = 'Brak danych';
          this.user.temp = 'Brak danych';
        });
    } else {
      this.user.humidity = 'Brak danych';
      this.user.temp = 'Brak danych';
    }
  }

  time() {
    return moment().format('YYYY/MM/DD HH:mm:ss');
  }

  weatherForecast() {
    this.weatherService.weatherForecastData(this.user.city, this.user.country).then((data) => {
      this.weatherData = data;
    }, (error) => {
        console.log('Weather API error', error);
    });
  }

  // changeWeather() { // opcja dla historii z przedziałem ale płatna w API openWeatherMap
  //   let beginRange = moment(this.weatherTime[0]).valueOf();
  //   let endRange =  moment(this.weatherTime[1]).valueOf();
  //   if (beginRange && endRange) {
  //     this.weatherService.getWeatherHistorical(this.user.city, this.user.country, beginRange, endRange).subscribe(data => {
  //       console.log('WeatherHistorical', data);
  //     }, (error) => {
  //       console.log('error', error);
  //       this.user.humidity = 'Brak danych';
  //       this.user.temp = 'Brak danych';
  //     });
  //   }
  // }

}
