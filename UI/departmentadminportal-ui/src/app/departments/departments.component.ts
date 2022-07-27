import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Department } from '../models/ui-models/department.model';
import { DepartmentService } from './department.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Employee } from '../models/ui-models/employee.model';
import { ConditionalExpr } from '@angular/compiler';

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

  departments: Department[] = [];
  columnsToDisplay = ['id', 'name', 'description', 'category', 'city', 'street', 'postalCode'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Department | null;


  dataSource: MatTableDataSource<Department> = new MatTableDataSource<Department>();

  constructor(private departmentService: DepartmentService) {
      this.expandedElement = null;
   }

  ngOnInit(): void {
    this.departmentService.getAllDepartments()
      .subscribe(
        (successResponse) => {
          this.departments = successResponse.items;
          this.dataSource = new MatTableDataSource<Department>(this.departments);
          console.log("dupa");
          console.log(this.dataSource);
          console.log(this.departments);
      },
      (errorResponse) => {
        console.log(errorResponse);

      }
      );
  }

  toggleRow(element: { expanded: boolean; }){
    element.expanded = !element.expanded;
  }


}
