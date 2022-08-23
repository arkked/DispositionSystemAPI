import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  loggedin: boolean = false;

  constructor(private auth: AuthService, private jwtHelper: JwtHelperService) {
    this.auth.loggedin.subscribe(v => this.loggedin = v);
   }

  ngOnInit(): void {
  }

  logOut()
  {
    this.auth.logOut();
    this.auth.isUserAuthenticated();
  }
}
