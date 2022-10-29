import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogContentWindowComponent } from 'src/app/dialog-content-window/dialog-content-window.component';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {

  loggedin: boolean = false;
  isAuthorized: boolean = false;
  token: string | null = localStorage.getItem("jwt");
  role: string = '';

  constructor(private auth: AuthService, private jwtHelper: JwtHelperService, public dialog: MatDialog)
  {
    this.auth.isUserAuthenticated();
    this.auth.loggedin.subscribe(v => this.loggedin = v);
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

