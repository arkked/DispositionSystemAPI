import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DepartmentService } from 'src/app/departments/department.service';
import { DialogContentWindowComponent } from 'src/app/dialog-content-window/dialog-content-window.component';
import { Action } from 'src/app/models/ui-models/action.model';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  loggedin: boolean = false;
  isAuthorized: boolean = false;
  token: string | null = localStorage.getItem("jwt");
  role: string = '';

  constructor(private auth: AuthService, private jwtHelper: JwtHelperService, public dialog: MatDialog)
  {
    this.auth.loggedin.subscribe(v => this.loggedin = v);
  }

  ngOnInit(): void {

  }

  logOut()
  {
    this.auth.logOut();
    this.auth.isUserAuthenticated();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentWindowComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    })

  }
}

