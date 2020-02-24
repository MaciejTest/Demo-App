import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { MessageService } from 'primeng/api';
import { User } from '@/models';
import 'rxjs/add/operator/map';
import {cloneDeep} from 'lodash';

class SubjectEvent {
  public type: string;
  public data: any;

  constructor(type, data?) {
      this.type = type;
      this.data = data;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public currentUser = null;
  public users = [];
  public subject: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    public messageService: MessageService
  ) {}

    getUsers() {
      return this.http.get<any>('assets/users.json')
        .toPromise()
        .then(res => <User[]> res.users)
        .then(usersData => {
          this.users = usersData;
          return usersData;
      });
    }

    saveUsers(user, type, index?) {
      switch (type) {
        case 'delete':
          this.users.splice(index, 1);
          break;
        case 'edit':
          this.users[index] = user;
          break;
        case 'create':
          this.users.push(user);
          break;
        default:
          break;
      }
      const usersCopy = cloneDeep(this.users);
      const userFiltred = usersCopy.map((user) => {
        delete user.humidity;
        delete user.temp;
        return user;
      });
      return  this.http.post('http://localhost:3000/saveUsers', userFiltred).subscribe(data => {
          this.messageService.add({severity: 'info', summary: '', detail: 'Użytkownicy zapisani poprawnie'});
        },
        (error) => {
          this.messageService.add({severity: 'error', summary: '', detail: 'Błąd zapisu użytkowników'});
      });
    }

    deleteUser(index) {
      this.users.splice(index, 1);
      this.saveUsers(this.users, 'delete', index);
    }

    emit(type: string, data?) {
      this.subject.next(new SubjectEvent(type, data));
    }
}
