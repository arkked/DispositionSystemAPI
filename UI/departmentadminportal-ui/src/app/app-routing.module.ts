import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ViewDepartmentComponent } from './departments/view-department/view-department.component';
import { ViewEmployeeComponent } from './departments/view-employee/view-employee.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: "departments",
    component: DepartmentsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'departments/:id',
    component: ViewDepartmentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'departments/:id/employees/:employeeId',
    component: ViewEmployeeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
