import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/api-models/department.model';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit {

  departmentId: number | null | undefined;
  department: Department = {
    id: 0,
    name: '',
    description: '',
    category: '',
    city: '',
    street: '',
    postalCode: '',
    contactEmail: '',
    contactNumber: ''
  }

  isNewDepartment = true;
  header = '';

  constructor(private readonly departmentService: DepartmentService,
              private readonly route: ActivatedRoute,
              private snackbar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(
        (params) => {

          if (!isNaN(Number(params.get('id')))) {
            this.departmentId = Number(params.get('id'));

            this.isNewDepartment = false;
            this.header = 'Edit Department';
            console.log(this.header);

            this.departmentService.getDepartmentById(this.departmentId)
            .subscribe(
              (successResponse) => {
                this.department = successResponse;
              }
            );
          }
          else {
            if (params.get('id')?.toLowerCase() === 'add') {
              this.isNewDepartment = true;
              this.header = 'Add Department';
            }
          }
        }
      );
  }

  onUpdate():void {
    this.departmentService.updateDepartment(this.department.id, this.department)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Department has been updated successfully', undefined, {
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
    this.departmentService.deleteDepartment(this.department.id)
    .subscribe(
      (successResponse) => {
        this.snackbar.open('Department has been deleted', undefined, {
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
    this.departmentService.addDepartment(this.department)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Department has been added succesfully', undefined, {
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
