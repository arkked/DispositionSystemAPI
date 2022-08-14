import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formData: any = {};
  errors: any = [];


  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register(): void {
    console.log(this.formData);

  }

}
