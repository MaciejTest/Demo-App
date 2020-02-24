import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsersService } from '@/services/users.service';
import { AuthenticationService } from '@/services/authentication.service';
import { ConfirmationService } from 'primeng/api';
import { User } from '@/models';
import { WeatherService } from '@/services/weather.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {

  public users: User[];
  public cols: any[];

  constructor(
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private weatherService: WeatherService,
    public usersService: UsersService,
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'firstName', header: 'Imię' },
      { field: 'lastName', header: 'Nazwisko' },
      { field: 'email', header: 'E-mail' },
      { field: 'city', header: 'Miasto' },
      { field: 'country', header: 'Kraj' }
    ];

    if (this.authenticationService.currentUserValue.role === 'admin') {
      this.cols.push({ field: 'temp', header: `Temperatura w ${String.fromCharCode(176)}C` });
      this.cols.push({ field: 'humidity', header: 'Wilgotność w %' });
    }

  }

  ngAfterViewInit() {
    this.usersService.getUsers().then((users) => {
      users.map((val) => {
        if (val.city !== '' && val.country !== '') {
            this.weatherService.getWeather(val.city, val.country).subscribe(data => {
              val['humidity'] = data['main'].humidity;
              val['temp'] = data['main'].temp;
            }, (error) => {
              val['humidity'] = 'Brak danych';
              val['temp'] = 'Brak danych';
            });
        } else {
          val['humidity'] = 'Brak danych';
          val['temp'] = 'Brak danych';
        }
      });
      this.users = users;
    });
  }

  confirmDeleteUser(index) {
    this.confirmationService.confirm({
      message: 'Napewno chesz usunąć tego użytkownika?',
      header: 'Usunięcie użytkownika',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(index);
      }
    });
  }

}
