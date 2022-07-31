import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from './departments/departments.component';
import { ViewDepartmentComponent } from './departments/view-department/view-department.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
