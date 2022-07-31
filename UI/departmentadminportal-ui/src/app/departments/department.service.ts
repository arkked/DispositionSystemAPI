import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    console.log(updateDepartmentRequest);

    return this.httpClient.put<Department>(this.baseApiUrl + '/department/' + departmentId, updateDepartmentRequest);

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

}
