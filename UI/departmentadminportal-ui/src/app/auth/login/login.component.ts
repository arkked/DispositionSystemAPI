import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin!: boolean;

  constructor(private router: Router, private http: HttpClient, private auth: AuthService) { }

  login(form: NgForm) {
    const credentials = {
      'email': form.value.username,
      'password': form.value.password
    }

    this.http.post("https://localhost:5001/api/account/login", credentials)
      .subscribe(
        (successResponse) => {
          const token = (<any>successResponse).token;
          localStorage.setItem("jwt", token);
          this.invalidLogin = false;
          this.router.navigate(["/"]);
          this.auth.isUserAuthenticated();

        },
        errorResponse => {
          this.invalidLogin = true;
        }
      )

  }

  isLoggedIn()
  {
    this.auth.isUserAuthenticated();
  }

}
