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
    email: '',
    city: '',
    street: '',
    postalCode: '',
    profileImageUrl: '',
    distance: 0,
    lat: 0,
    lng: 0,
    actionId: 0
  }

  isNewEmployee = true;
  header = '';
  displayProfileImageUrl = '';

  constructor(private readonly departmentService: DepartmentService,
              private readonly route: ActivatedRoute,
              private snackbar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {

        if (!isNaN(Number(params.get('employeeId')))) {

          this.departmentId = Number(params.get('id'));
          this.employeeId = Number(params.get('employeeId'));

          this.isNewEmployee = false;
          this.header = 'Edit Employee';

          this.departmentService.getEmployeeById(this.departmentId, this.employeeId)
          .subscribe(
            (successResponse) => {
              this.employee = successResponse;
              this.setImage();
            },
            (errorResponse) => {
              console.log("error:" + errorResponse);
              this.setImage();
            }
          );

        }
        else {
          if (params.get('employeeId')?.toLowerCase() === 'add') {
            this.departmentId = Number(params.get('id'));
            this.isNewEmployee = true;
            this.header = 'Add Employee';
            this.setImage();
          }
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

  onAdd() : void {
    this.departmentService.addEmployee(this.departmentId, this.employee)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Employee has been added succesfully', undefined, {
            duration: 2000
          });

          this.router.navigateByUrl('departments');

        },
        (errorResponse) => {
          console.log(errorResponse);
          this.snackbar.open('Something went wrong', undefined, {
            duration: 2000
          });
        }
      )
  }

  uploadImage(event: any) : void {
    if (this.employeeId) {
      const file: File = event.target.files[0];
      this.departmentService.uploadImage(this.departmentId, this.employee.id, file)
        .subscribe(
          (successResponse) => {
            this.employee.profileImageUrl = successResponse;
            this.setImage();

            this.snackbar.open('Employee has been updated successfuly', undefined, {
              duration: 2000
            });
          },
          (errorResponse) => {
          }
        );
    }
  }

  private setImage(): void {
    if (this.employee.profileImageUrl) {
      this.displayProfileImageUrl = this.departmentService.getImagePath(this.employee.profileImageUrl);

    }
    else {
      this.displayProfileImageUrl = '/assets/default-user.png';
    }
  }

}
