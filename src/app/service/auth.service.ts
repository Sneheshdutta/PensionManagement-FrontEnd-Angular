import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject: any;
  currentUser: any;
  currentUserValue: any;
  token: any | undefined

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = localStorage.getItem('currentUser')
  }

  logout() {
    // remove user from local storage to log user out
    console.log("In logout")
    localStorage.removeItem('currentUser');
    return true;
  }

  login(data:User) {
    return this.http.post<any>(`${environment.login}`,  data )
    .pipe(map(response => {
      console.log(response);
      // login successful if there's a jwt token in the response
      if(response.status == 500) {
        return response;
      }
      if (response.data && response.status == 200) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', response.data);
        this.token = localStorage.getItem('currentUser')
        console.log("Local Storage - "+this.token)
        this.currentUserSubject.next(response.data);
      }

      return response;
    }));
  }

  register(registerData:User) {
    return this.http.post<any>(`${environment.register}`, registerData)
    .pipe(map(response => {
      console.log(response);
      return response;
    }));
  }

  gettoken(){  
    return !!localStorage.getItem("currentUser");  
    }  

}
