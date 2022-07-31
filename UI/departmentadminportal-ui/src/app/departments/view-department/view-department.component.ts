import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    imageUrl: '',
    contactEmail: '',
    contactNumber: ''
  }

  constructor(private readonly departmentService: DepartmentService,
              private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(
        (params) => {
          this.departmentId = Number(params.get('id'));

          if (this.departmentId) {
            this.departmentService.getDepartmentById(this.departmentId)
              .subscribe(
                (successResponse) => {
                  this.department = successResponse;
                }
              );
          }
        }
      );
  }

  onUpdate():void {
    this.departmentService.updateDepartment(this.department.id, this.department)
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
