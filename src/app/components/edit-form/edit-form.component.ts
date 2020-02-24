import { Component, OnInit, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { HelperService } from '@/services/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@/models';
import { Subscription } from 'rxjs';
import { UsersService } from '@/services/users.service';
import { MessageService } from 'primeng/api';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { WeatherService } from '@/services';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() userData: User;
  private subscription: Subscription;
  public editForm: FormGroup;
  public displayForm = false;
  public displayType: string ;
  public submitted = false;
  public typeAccounts = [
    {label: 'Administrator', value: 'admin' },
    {label: 'Użytkownik', value: 'user' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService,
    public messageService: MessageService,
    public helperService: HelperService,
    public usersService: UsersService,
  ) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    });
  }


  getPassword() {
    const password =  this.helperService.passwordGenerate();
    this.editForm.patchValue({
      password: password,
      passwordRepeat: password
    });
  }

  cancel() {
    this.displayForm = false;
    this.submitted = false;
    this.editForm.reset();
  }

  formTitle() {
    let title = '';
    if (this.displayType === 'create') {
        title = 'Utworzenie użytkownika';
    } else if (this.displayType === 'edit') {
        title = 'Edycja użytkownika';
    }
    return title;
  }

  get form() { return this.editForm.controls; }

  cleanUser() {
    this.userData = {
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
  }

  onSubmit() {
    this.submitted = true;
    let user = cloneDeep(this.editForm.value);
    delete user.passwordRepeat;
    if (this.displayType === 'create' && this.editForm.valid) {
        user.id = moment().valueOf();
        this.usersService.saveUsers(this.refreshWeather(user), 'create');
        this.messageService.add({severity: 'info', summary: '', detail: 'Użytkownik dodany i zapisany'});
        this.cancel();
    } else if (this.displayType === 'edit' && this.editForm.valid) {
        const index = this.usersService.users.findIndex((val) => {return val.id === user.id });
        const copyUser = cloneDeep(this.refreshWeather(this.usersService.users[index]));
        user.humidity = copyUser.humidity;
        user.temp = copyUser.temp;
        this.usersService.saveUsers(user, 'edit', index);
        this.messageService.add({severity: 'info', summary: '', detail: 'Użytkownik edytowany'});
        this.cancel();
    }

  }

  ngAfterViewInit() {
    this.subscription = this.usersService.subject.subscribe(data => {
      switch (data.type) {
        case 'createUser':
          this.displayType = 'create';
          this.displayForm = true;
          break;
        case 'editUser':
          this.userData = data.data;
          this.editForm.patchValue({
            id: this.userData.id,
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            role: this.userData.role,
            city: this.userData.city,
            country: this.userData.country,
            password: this.userData.password,
            passwordRepeat: this.userData.password
          });
          this.displayType = 'edit';
          this.displayForm = true;
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshWeather(user) {
    this.weatherService.getWeather(user.city, user.country).subscribe(data => {
      user['humidity'] = data['main'].humidity;
      user['temp'] = data['main'].temp;
    }, (error) => {
      user['humidity'] = 'Brak danych';
      user['temp'] = 'Brak danych';
    });
    return user;
  }


}
