import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/api-models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public register(user: User): Observable<any> {
    return this.http.post<any>(
      'https://localhost:5001/api/account/register', user);
  }

  public login(user: User) : Observable<string> {
    return this.http.post(
      'https://localhost:5001/api/account/login',
       user, { responseType: 'text' }
    );
  }

  isUserAuthenticated() {
    const token: string | null = localStorage.getItem("jwt");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.loggedin.next(true);
      return true;
    }
    else {
      this.loggedin.next(false);
      return false;
    }
  }

    logOut() {
    localStorage.removeItem("jwt");
  }

}
