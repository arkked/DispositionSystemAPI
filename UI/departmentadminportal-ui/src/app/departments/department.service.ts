import { HttpClient } from '@angular/common/http';
import { TemplateBindingParseResult, ThisReceiver } from '@angular/compiler';
import { Injectable, resolveForwardRef } from '@angular/core';
import { from, Observable } from 'rxjs';
import { AddDepartmentRequest } from '../models/api-models/add-department-request.model';
import { AddEmployeeRequest } from '../models/api-models/add-employee-request.model';
import { Department } from '../models/api-models/department.model';
import { Employee } from '../models/api-models/employee.model';
import { UpdateDepartmentRequest } from '../models/api-models/update-department-request';
import { UpdateEmployeeRequest } from '../models/api-models/update-employee-request';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseApiUrl = 'https://localhost:5001/api';

  geocoder = new google.maps.Geocoder();

  employeeRequest!: Employee;
  position!: google.maps.LatLng[];

  constructor(private httpClient: HttpClient) { }

  getAllDepartments(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.baseApiUrl + '/department');
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.httpClient.get<Department>(this.baseApiUrl + '/department/' + id);
  }

  getEmployeeById(departmentId: number, employeeId: number): Observable<Employee> {
    return this.httpClient.get<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId);
  }

  updateDepartment(departmentId: number, departmentRequest: Department): Observable<Department> {
    const updateDepartmentRequest: UpdateDepartmentRequest = {
      name: departmentRequest.name,
      description: departmentRequest.description,
      category: departmentRequest.category,
      city: departmentRequest.city,
      street: departmentRequest.street,
      postalCode: departmentRequest.postalCode,
      contactEmail: departmentRequest.contactEmail,
      contactNumber: departmentRequest.contactNumber
    }

    return this.httpClient.put<Department>(this.baseApiUrl + '/department/' + departmentId, updateDepartmentRequest);

  }

  deleteDepartment(departmentId: number) : Observable<Department>{
    return this.httpClient.delete<Department>(this.baseApiUrl + "/department/" + departmentId);
  }

  addDepartment(departmentRequest: Department) : Observable<Department> {

    const addDepartmentRequest: AddDepartmentRequest = {
      name: departmentRequest.name,
      description: departmentRequest.description,
      category: departmentRequest.category,
      city: departmentRequest.city,
      street: departmentRequest.street,
      postalCode: departmentRequest.postalCode,
      contactEmail: departmentRequest.contactEmail,
      contactNumber: departmentRequest.contactNumber
    }

    return this.httpClient.post<Department>(this.baseApiUrl + '/department', addDepartmentRequest);

  }

  addEmployee(departmentId: number, employeeRequest: Employee) : Observable<Employee> {

    this.employeeRequest = employeeRequest;
    console.log(this.employeeRequest);

    let employeeAddress = '';
    employeeAddress += this.employeeRequest.street + ", " + this.employeeRequest.city;

    return this.geocodeEmployees({address: employeeAddress}, departmentId);
  }


  updateEmployee(departmentId: number, employeeId: number, employeeRequest: Employee) : Observable<Employee> {

    const updateEmployeeRequest: UpdateEmployeeRequest = {
      firstName: employeeRequest.firstName,
      lastName: employeeRequest.lastName,
      city: employeeRequest.city,
      street: employeeRequest.street,
      postalCode: employeeRequest.postalCode,
      lat: employeeRequest.lat,
      lng: employeeRequest.lng
    }

    return this.httpClient.put<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId, updateEmployeeRequest);
  }

  deleteEmployee(departmentId: number, employeeId: number) : Observable<Employee> {
    return this.httpClient.delete<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId);
  }

  uploadImage(departmentId: number, employeeId: number, file: File) : Observable<any> {
    const formData = new FormData();

    formData.append("file", file);

    return this.httpClient.post(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId + '/files/upload-image', formData, {
      responseType: 'text'
    });
  }

  getImagePath(relativePath: string) {
    return `${this.baseApiUrl}/${relativePath}`;
  }

  geocodeEmployees(request: google.maps.GeocoderRequest, departmentId: number) : Observable<Employee>
  {
     const result = from(this.geocoder.geocode(request).then((result) => {

      const { results } = result;

      this.employeeRequest.lat = results[0].geometry.location.lat();
      this.employeeRequest.lng = results[0].geometry.location.lng();

      var temp = new google.maps.LatLng( this.employeeRequest.lat, this.employeeRequest.lng)
      console.log(temp);

      this.position.push(temp)

      console.log(this.employeeRequest.lat);
      console.log(this.employeeRequest.lng);

      console.log(this.employeeRequest);

      return this.employeeRequest;
    }));


    console.log(this.employeeRequest);
    console.log(this.employeeRequest.lat);
    console.log(this.employeeRequest.lng);


    // const obj$ = from(result);
     return this.httpClient.post<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee', this.employeeRequest);

  }
}
