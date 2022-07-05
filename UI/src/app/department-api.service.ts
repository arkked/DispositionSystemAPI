import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class DepartmentApiService {

  readonly departmentAPIUrl = "https://localhost:5001/api";
  readonly profilePicture = "https://localhost:5001/Photos";    //TO DO

  constructor(private http:HttpClient) { }

  //Departments

  getDepartmentsList() {
    return this.http.get(this.departmentAPIUrl + "/department?pageSize=10&pageNumber=1"); // OK

  }

  addDepartment(data:any) {
    return this.http.post(this.departmentAPIUrl + "/department", data);
  }

  updateDepartment(id:number, data:any){
    return this.http.put(this.departmentAPIUrl + `/department/${id}`, data);
  }

  deleteDepartment(id:number){
    return this.http.delete(this.departmentAPIUrl + `/department/${id}`);
  }

  //Employees

  getEmployeeList(departmentId:number):Observable<any[]> {
    return this.http.get<any>(this.departmentAPIUrl + `/department/${departmentId}/employee`);
  }

  addEmployee(departmentId:number, data:any) {
    return this.http.post(this.departmentAPIUrl + `/department/${departmentId}/employee`, data);
  }

  updateEmployee(employeeId:number, departmentId:number, data:any){
    return this.http.put(this.departmentAPIUrl + `/department/${departmentId}/employee/${employeeId}`, data);
  }

  deleteEmployee(deparmentId:number, employeeId:number){
    return this.http.delete(this.departmentAPIUrl + `/department/${deparmentId}/employee/${employeeId}`);
  }



}
