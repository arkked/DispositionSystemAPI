import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Department } from '../models/ui-models/department.model';
import { DepartmentService } from './department.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Employee } from '../models/ui-models/employee.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GoogleMap } from '@angular/google-maps';
import { Action } from '../models/api-models/action.model';
import { SignalRService } from './signal-r.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DepartmentsComponent implements OnInit {

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild('outerSort', {static: true}) sort!: MatSort;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<Employee>>;

  token: string | null = localStorage.getItem("jwt");

  dataSource: MatTableDataSource<Department> = new MatTableDataSource<Department>([]);
  departments: Department[] = [];
  columnsToDisplay = ['id', 'name', 'description', 'category', 'city', 'street', 'postalCode', 'contactEmail', 'contactNumber'];
  innerDisplayedColumns = ['id', 'firstName', 'lastName', 'email', 'city', 'street', 'postalCode'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'edit', 'expand'];
  innerDisplayedColumnsWithExpand = [...this.innerDisplayedColumns, 'edit'];
  expandedElement: Department | null;
  role: string = '';
  isAuthorized: boolean = false;

  filterString = '';

  constructor(private departmentService: DepartmentService, private cd: ChangeDetectorRef,
              public signalRService: SignalRService, private http: HttpClient) {
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

  ngOnInit(): void {
    this.departmentService.getAllDepartments()
      .subscribe(
        (successResponse) => {
            successResponse.forEach(department => {
            if (department.employees && Array.isArray(department.employees) && department.employees.length) {
              this.departments = [...this.departments, {...department, employees: new MatTableDataSource(department.employees)}];
            }
            else {
              this.departments = [...this.departments, department];
            }
           });

           this.dataSource = new MatTableDataSource(this.departments);

           if (this.matPaginator) {
            this.dataSource.paginator = this.matPaginator;
           }

           this.dataSource.sort = this.sort;
      },
      (errorResponse) => {
        console.log(errorResponse);
      });

      //this.startHttpRequest();
      this.signalRService.startConnection();
      this.signalRService.addTransferNotificationDataListener();



  }

  toggleRow(element: Department) {
    element.employees && (element.employees as MatTableDataSource<Employee>).data.length ?
    (this.expandedElement = this.expandedElement === element ? null : element) : null;

    this.cd.detectChanges();

    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Employee>).sort = this.innerSort.toArray()[index]);
  }

  filterDepartments(){
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/notifications')
      .subscribe(successResponse => {
        console.log(successResponse);

      })
  }
}
