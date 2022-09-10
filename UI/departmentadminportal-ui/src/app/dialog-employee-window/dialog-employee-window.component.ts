import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from '../departments/department.service';
import { Department } from '../models/ui-models/department.model';
import { Employee } from '../models/ui-models/employee.model';

@Component({
  selector: 'app-dialog-employee-window',
  templateUrl: './dialog-employee-window.component.html',
  styleUrls: ['./dialog-employee-window.component.css']
})
export class DialogEmployeeWindowComponent implements OnInit {

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  employees: Employee[] = [];
  departments: Department[] = [];
  columnsToDisplay = ['id', 'firstName', 'lastName', 'city', 'street', 'postalCode'];
  columnsToDisplayWithAssign = [...this.columnsToDisplay, 'assign'];
  isAuthorized: boolean = false;
  token: string | null = localStorage.getItem("jwt");
  role: string = '';

  constructor(private departmentService: DepartmentService, private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<DialogEmployeeWindowComponent>) {

     }

  ngOnInit(): void {
    this.departmentService.getAllDepartments()
    .subscribe(
      (successResponse) => {
        successResponse.forEach(department => {
          if (department.employees && Array.isArray(department.employees) && department.employees.length) {
            this.employees = [...this.employees, ...department.employees];
            this.departments = [...this.departments, department]
          }
          else {
            this.departments = [...this.departments, department];
          }
         });

         this.employees.forEach(employee => {
            if (employee.actionId) {
              this.employees = this.employees.filter(item => item !== employee);
            }
          });

         this.dataSource = new MatTableDataSource(this.employees);

      }
    )
  }

  onAssignEmployee(employeeId: number){

    let departmentId;

    this.departments.forEach(department => {
      if (department.employees && Array.isArray(department.employees) && department.employees.length){
        department.employees.forEach(employee => {
          if (employee.id === employeeId) {
            departmentId = department.id;
          }
        })
      }
    })

    if (typeof departmentId !== 'undefined') {
      this.departmentService.assignEmployee(this.data, departmentId, employeeId).subscribe(
        (successResponse) => {
          this.employees = this.employees.filter(employee => employee.id !== employeeId)
          this.snackbar.open('Employee has been assigned successfully', undefined, {
            duration: 2000
          });

          console.log(this.employees);

        }
      )
    }

  }

}
