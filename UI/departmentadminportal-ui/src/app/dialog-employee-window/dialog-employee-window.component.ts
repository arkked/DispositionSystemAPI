import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from '../departments/department.service';
import { Action } from '../models/api-models/action.model';
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
  actions: Action[] = [];
  columnsToDisplay = ['firstName', 'lastName', 'distance', 'city', 'street', 'postalCode'];
  columnsToDisplayWithAssign = ['assign', ...this.columnsToDisplay];
  isAuthorized: boolean = false;
  token: string | null = localStorage.getItem("jwt");
  role: string = '';
  distance: number = 0;

  constructor(private departmentService: DepartmentService, private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: Action,
    public dialogRef: MatDialogRef<DialogEmployeeWindowComponent>) {}

  ngOnInit(): void {
    this.departmentService.getAllDepartments()
    .subscribe(
      (successResponse) => {
        successResponse.forEach(department => {
          if (department.employees && Array.isArray(department.employees) && department.employees.length) {
            this.employees = [...this.employees, ...department.employees];
            this.departments = [...this.departments, department];
          }
          else {
            this.departments = [...this.departments, department];
          }
         });

         this.employees.forEach(employee => {
            if (employee.actionId) {
              this.employees = this.employees.filter(item => item !== employee);
            }

            employee.distance = Math.round(this.calculateDistance(this.data, employee) * 10) / 10;
          });

          this.employees.sort((a, b) => a.distance - b.distance)

          this.dataSource = new MatTableDataSource(this.employees);
      }
    )
  }

  calculateDistance(action: Action, employee: Employee) : number {
    let x1 = employee.lat;
    let x2 = action?.lat;

    let y1 = employee.lng;
    let y2 = action?.lng;

    if (x2 !== undefined && y2 !== undefined) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 111;
    }
    else {
      return 0;
    }
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
      this.departmentService.assignEmployee(this.data.id, departmentId, employeeId).subscribe(
        (successResponse) => {
          this.employees = this.employees.filter(employee => employee.id !== employeeId)
          this.snackbar.open('Employee has been assigned successfully', undefined, {
            duration: 2000
          });
        }
      )
    }
  }
}
