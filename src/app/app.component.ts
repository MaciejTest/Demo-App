import { Component,
         OnInit,
         OnDestroy,
         AfterViewInit,
         ViewEncapsulation,
         ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { User } from './models';
import { PdfService } from '@/services/pdf.service';
import { AuthenticationService } from './services';
import emailjs from 'emailjs-com';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { UsersService } from '@/services/users.service';
import { WeatherService } from '@/services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(EditFormComponent, {static: false}) editForm;
  private subscription: Subscription;
  public title = 'demoApp';
  public weatherData = [];
  public menus: MenuItem[];
  public buttons = true;
  public currentUser: User;
  public cd;
  public userData: User = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      role: '',
      country: '',
      password: '',
      token: '',
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    public usersService: UsersService,
    public pdfService: PdfService,
    public weatherService: WeatherService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.subscription = this.usersService.subject.subscribe(data => {
          switch (data.type) {
            case 'exportToPDF':
              this.weatherService.weatherForecastData(data.data.city, data.data.country).then((weatherResponse) => {
                this.pdfService.generateUserPDF(data.data, weatherResponse);
              }, (error) => {
                  console.log('Weather API error', error);
              });
              break;
            case 'sendEmail':
              this.sendEmail(data.data);
              break;
            default:
              break;
          }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendEmail(user) {

    // alternatywna opcja wysyłania hasła na emaila
    // const templateParams = {
    //   name: 'Potwierdzenie hasła',
    //   message_html: `Twoje użytwkoniku ${user.firstName} ${user.lastName} hasło do konta to:  ${user.password}`
    // };
    // emailjs.send('gmail','template_5KDUV9xG', templateParams,'user_DDkRMo3YfIJFMubRPmNte' )
    // .then(function(response) {
    //    this.messageService.add({severity: 'info', summary: '', detail: 'Email został wysłany'});
    // }, function(err) {
    //    this.messageService.add({severity: 'danger', summary: '', detail: 'Błąd wysłania emaila'});
    // });

    this.http.post('http://localhost:3000/sendMail', user).subscribe(data => {
        const res: any = data;
        this.messageService.add({severity: 'info', summary: '', detail: 'Email został wysłany'});
      },
      (error) => {
        this.messageService.add({severity: 'error', summary: '', detail: 'Błąd wysłania emaila'});
      });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
