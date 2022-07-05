import { Component, Input, OnInit } from '@angular/core';
import { DepartmentApiService } from 'src/app/department-api.service';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.css']
})
export class AddEditDepartmentComponent implements OnInit {

  constructor() { }

  @Input() dep:any;


  ngOnInit(): void {
  }

}
