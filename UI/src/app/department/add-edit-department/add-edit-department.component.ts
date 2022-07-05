import { Component, Input, OnInit } from '@angular/core';
import { DepartmentApiService } from 'src/app/department-api.service';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.css']
})
export class AddEditDepartmentComponent implements OnInit {

  constructor(private service:DepartmentApiService) { }

  @Input() dep:any;
  Id!: number;
  Name!: string;
  Description!: string;
  Category!: string;
  City!: string;
  Street!: string;
  PostalCode!: string;
  ContactEmail!: string;
  ContactNumber!: string;

  @Input() totalItemsCount!:number;


  ngOnInit(): void {
    this.Id = this.dep.id;
    this.Name = this.dep.name;
    this.Description = this.dep.description;
    this.Category = this.dep.category;
    this.City = this.dep.city;
    this.Street = this.dep.street;
    this.PostalCode = this.dep.postalCode;
    this.ContactEmail = this.dep.contactEmail;
    this.ContactNumber = this.dep.contactNumber;
  }

  addDepartment(){
      var department =
      {
          Name:this.Name,
          Description:this.Description,
          Category:this.Category,
          City:this.Category,
          Street:this.Street,
          PostalCode:this.PostalCode,
          ContactNumber:this.ContactNumber,
          ContactEmail:this.ContactEmail
      };

      this.service.addDepartment(department).subscribe(response => {
        alert(department.toString());
      });
  }

  updateDepartment(){
    var department =
    {
        Id:this.Id,
        Name:this.Name,
        Description:this.Description,
        Category:this.Category,
        City:this.City,
        Street:this.Street,
        PostalCode:this.PostalCode,
        ContactNumber:this.ContactNumber,
        ContactEmail:this.ContactEmail
    };

    this.service.updateDepartment(this.Id, department).subscribe(response => {
      //alert(response.toString());
    });
  }

}
