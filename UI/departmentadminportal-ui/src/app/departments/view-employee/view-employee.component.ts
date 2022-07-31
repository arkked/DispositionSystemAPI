import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/api-models/employee.model';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {

  departmentId!: number; //| null | undefined;
  employeeId: number | null | undefined;

  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    postalCode: '',
    profileImageUrl: ''
  }


  constructor(private readonly departmentService: DepartmentService,
              private readonly route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params) => {
        this.departmentId = Number(params.get('id'));
        this.employeeId = Number(params.get('employeeId'));

        if (this.departmentId && this.employeeId) {
          this.departmentService.getEmployeeById(this.departmentId, this.employeeId)
          .subscribe(
            (successResponse) => {
              console.log(successResponse);
              this.employee = successResponse;
            }
          )
        }

      }
    );
  }

  onUpdate():void {
    this.departmentService.updateEmployee(this.departmentId, this.employee.id, this.employee)
      .subscribe(
        (successResponse) => {
          console.log(successResponse);
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
  }

}
