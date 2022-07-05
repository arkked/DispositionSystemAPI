import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentApiService } from 'src/app/department-api.service';

@Component({
  selector: 'app-show-department',
  templateUrl: './show-department.component.html',
  styleUrls: ['./show-department.component.css']
})
export class ShowDepartmentComponent implements OnInit {

  departmentList:any = [];

  ModalTitle!:string;
  ActivateAddEditDepComp:boolean=false;
  dep:any;
  // employeeList$!:Observable<any[]>;

  // employeeList:any=[];

  // employeeMap:Map<number, string> = new Map()

  constructor(private service:DepartmentApiService) { }

  ngOnInit() {

    this.refreshDepartmentList();

  }

  addClick(){
      this.dep = {
        name: "",
        description: "",
        category: "",
        contactEmail: "",
        contactNumber: "",
        city: "",
        street: "",
        postalCode: ""
      }

      this.ModalTitle = "Add Department";
      this.ActivateAddEditDepComp = true;
  }

  closeClick(){
    this.ActivateAddEditDepComp = false;
    this.refreshDepartmentList();
  }

  refreshDepartmentList(){
    this.service.getDepartmentsList().subscribe(
      data => {
      this.departmentList = data;
      console.log("refresh");
      console.log(data);
    });

  }


}
