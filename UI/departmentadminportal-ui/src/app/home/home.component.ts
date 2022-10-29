import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  loggedin: boolean = false;
  fullName: string = '';

  token: string | null = localStorage.getItem("jwt");

  constructor(private auth: AuthService) {
    this.auth.loggedin.subscribe(v => this.loggedin = v);

    if (this.token != null) {
      let jwtData = this.token.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      this.fullName = decodedJwtData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    }
   }
}
