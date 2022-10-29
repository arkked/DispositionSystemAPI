import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formData: any = {};
  errors: any = [];

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) { }

  register(form: NgForm){

    let serializedForm = JSON.stringify(form.value);
    console.log(serializedForm);

    this.http.post("https://localhost:5001/api/account/register", serializedForm, this.httpOptions)
      .subscribe(
        (successResponse) => {
          this.auth.isUserAuthenticated();
          this.router.navigate(["/"]);
        }
      )
  }
}
