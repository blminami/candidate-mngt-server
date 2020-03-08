import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
    console.log("API URL:", environment.apiUrl);
  }

  login(username: string, password: string) {
    return this.http.post(environment.apiUrl + '/users/authenticate', { username: username, password: password })
      .pipe(
        map((user: any) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
