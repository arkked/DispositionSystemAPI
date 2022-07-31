import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from './departments/departments.component';
import { ViewDepartmentComponent } from './departments/view-department/view-department.component';
import { ViewEmployeeComponent } from './departments/view-employee/view-employee.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentsComponent
  },
  {
    path: "departments",
    component: DepartmentsComponent
  },
  {
    path: 'departments/:id',
    component: ViewDepartmentComponent
  },
  {
    path: 'departments/:id/employees/:employeeId',
    component: ViewEmployeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
