import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    const addEmployeeRequest: AddEmployeeRequest = {
      firstName: employeeRequest.firstName,
      lastName: employeeRequest.lastName,
      city: employeeRequest.city,
      street: employeeRequest.street,
      postalCode: employeeRequest.postalCode
    }

    return this.httpClient.post<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee', addEmployeeRequest);
  }


  updateEmployee(departmentId: number, employeeId: number, employeeRequest: Employee) : Observable<Employee> {
    const updateEmployeeRequest: UpdateEmployeeRequest = {
      firstName: employeeRequest.firstName,
      lastName: employeeRequest.lastName,
      city: employeeRequest.city,
      street: employeeRequest.street,
      postalCode: employeeRequest.postalCode
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

}
