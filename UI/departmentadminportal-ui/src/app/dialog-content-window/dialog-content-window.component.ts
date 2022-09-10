import { ChangeDetectorRef, Component, OnInit, ViewChildren, QueryList, Output, EventEmitter, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from '../departments/department.service';
import { Action } from '../models/ui-models/action.model';
import { Employee } from '../models/ui-models/employee.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogEmployeeWindowComponent } from '../dialog-employee-window/dialog-employee-window.component';
import { Department } from '../models/ui-models/department.model';


@Component({
  selector: 'app-dialog-content-window',
  templateUrl: './dialog-content-window.component.html',
  styleUrls: ['./dialog-content-window.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DialogContentWindowComponent implements OnInit {

  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<Employee>>;

  dataSource: MatTableDataSource<Action> = new MatTableDataSource<Action>([]);
  actions: Action[] = [];
  @Input() departments: Department[] = [];
  columnsToDisplay = ['id', 'name', 'lat', 'lng'];
  innerDisplayedColumns = ['id', 'firstName', 'lastName', 'city', 'street', 'postalCode'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'delete', 'expand'];
  innerDisplayedColumnsWithExpand = [...this.innerDisplayedColumns, 'delete'];
  expandedElement: Action | null;
  isAuthorized: boolean = false;
  token: string | null = localStorage.getItem("jwt");
  role: string = '';


  constructor(private departmentService: DepartmentService, private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar, public dialog: MatDialog) {
    this.expandedElement = null;
    if (this.token != null) {
      let jwtData = this.token.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      this.role = decodedJwtData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (this.role === 'Manager' || this.role === 'Admin') {
        this.isAuthorized = true;
      }

    }
  }

  ngOnInit() {
    this.departmentService.getActions()
    .subscribe(
      (successResponse) => {
        successResponse.forEach(action => {
          if (action.employees && Array.isArray(action.employees) && action.employees.length){
            this.actions = [...this.actions, {...action, employees: new MatTableDataSource(action.employees)}];
          }
          else {
            this.actions = [...this.actions, action];
          }
        });

        this.dataSource = new MatTableDataSource(this.actions);

      }
    )

  }

  ngOnChanges() {
    this.departmentService.getActions()
    .subscribe(
      (successResponse) => {
        successResponse.forEach(action => {
          if (action.employees && Array.isArray(action.employees) && action.employees.length){
            this.actions = [...this.actions, {...action, employees: new MatTableDataSource(action.employees)}];
          }
          else {
            this.actions = [...this.actions, action];
          }
        });

        this.dataSource = new MatTableDataSource(this.actions);

      }
    )
  }

  toggleRow(element: Action) {
    element.employees && (element.employees as MatTableDataSource<Employee>).data.length ?
    (this.expandedElement = this.expandedElement === element ? null : element) : null;

    this.cd.detectChanges();
  }

  onDeleteAction(actionId: number) : void {
    this.departmentService.deleteAction(actionId)
      .subscribe((successRespone) => {


        this.snackbar.open('Action has been deleted', undefined, {
          duration: 2000
        });

        let actionDelete;
        this.actions.forEach(action => {
          if (action.id === actionId) {
            actionDelete = action;
          }
        })

        if (actionDelete) {
          let index = this.actions.indexOf(actionDelete);
          this.actions.splice(index, 1);
        }

      })
  }

  openEmployeeDialog(actionId: number) {
    const dialogRef = this.dialog.open(DialogEmployeeWindowComponent, {
      data: actionId
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })

  }

  onUnassignEmployee(employeeId: number) : void {
    console.log("unassign action invoked with id", employeeId);

    this.departmentService.getAllDepartments().subscribe(successResponse => {
      successResponse.forEach(department => {
        this.departments = [...this.departments, department];
      })

      console.log(this.departments);

      this.departments.forEach(department => {
        if (department.employees) {
          (department.employees as Employee[]).forEach(employee => {
            if (employee.id === employeeId) {
              employee.actionId = undefined;
              this.departmentService.updateEmployee(department.id, employeeId, employee).subscribe(successResponse => {
                this.snackbar.open('Employee has been unassigned', undefined, {
                  duration: 2000
                });
              })
            }
          })
        }
      })

    })
  }
}
