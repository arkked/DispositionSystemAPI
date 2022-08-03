import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
              private readonly route: ActivatedRoute,
              private snackbar: MatSnackBar,
              private router: Router) { }

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
          this.snackbar.open('Employee has been updated successfuly', undefined, {
            duration: 2000
          });
        },
        (errorResponse) => {
          this.snackbar.open('Something went wrong', undefined, {
            duration: 2000
          });
        }
      );
  }

  onDelete(): void {
    this.departmentService.deleteEmployee(this.departmentId, this.employee.id)
    .subscribe(
      (successResponse) => {
        this.snackbar.open('Employee has been deleted', undefined, {
          duration: 2000
        });

        this.router.navigateByUrl('departments');
      },
      (errorResponse) => {
        this.snackbar.open('Something went wrong', undefined, {
          duration: 2000
        });
      }
    )
  }

}
