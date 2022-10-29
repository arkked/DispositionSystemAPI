import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap, tap } from 'rxjs';
import { Action } from '../models/api-models/action.model';
import { AddActionRequest } from '../models/api-models/add-action-request.model';
import { Department } from '../models/api-models/department.model';
import { Employee } from '../models/api-models/employee.model';
import { UpdateActionRequest } from '../models/api-models/update-action-request.model';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseApiUrl = 'https://localhost:5001/api';

  geocoder = new google.maps.Geocoder();

  employeeRequest!: Employee;
  departmentRequest!: Department;
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

  callAfterUpdateDepartment(departmentId: number) : Observable<Department> {
    console.log(this.departmentRequest);

    return this.httpClient.put<Department>(this.baseApiUrl + '/department/' + departmentId, this.departmentRequest);
  }

  updateDepartment(departmentId: number, departmentRequest: Department): Observable<Department> {

    this.departmentRequest = departmentRequest;

    let departmentAddress = '';
    departmentAddress += this.departmentRequest.street + ", " + this.departmentRequest.city;
    var department = this.geocodeDepartment({address: departmentAddress});

    return department.pipe(tap(departmentResponse => this.setUpdatedDepartment(departmentResponse)),
      switchMap(_=>this.callAfterUpdateDepartment(departmentId)));
  }

  deleteDepartment(departmentId: number) : Observable<Department>{
    return this.httpClient.delete<Department>(this.baseApiUrl + "/department/" + departmentId);
  }

  setUpdatedDepartment(departmentResponse: Department) {
    if (departmentResponse) {
      this.departmentRequest= departmentResponse;
    }
  }

  callAfterAddUpdatedDepartment() : Observable<Department> {
    return this.httpClient.post<Department>(this.baseApiUrl + '/department', this.departmentRequest);
  }

  addDepartment(departmentRequest: Department) : Observable<Department> {

    this.departmentRequest = departmentRequest;
    let departmentAddress = '';
    departmentAddress += departmentRequest.street + ", " + departmentRequest.city;
    var department = this.geocodeDepartment({address: departmentAddress});

    console.log(department);
    return department.pipe(tap(departmentResponse => this.setUpdatedDepartment(departmentResponse)),
    switchMap(_=>this.callAfterAddUpdatedDepartment()))
  }

  setUpdatedEmployee(employeeResponse: Employee) {
    if (employeeResponse) {
      this.employeeRequest= employeeResponse;
    }
  }

  callAfterAddUpdatedEmployee(departmentId: number) : Observable<Employee> {
    return this.httpClient.post<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee', this.employeeRequest);
  }

  addEmployee(departmentId: number, employeeRequest: Employee) : Observable<Employee> {

    this.employeeRequest = employeeRequest;
    let employeeAddress = '';
    employeeAddress += this.employeeRequest.street + ", " + this.employeeRequest.city;
    var employee = this.geocodeEmployee({address: employeeAddress});

    return employee.pipe(tap(employeeResponse => this.setUpdatedEmployee(employeeResponse)),
      switchMap(_=>this.callAfterAddUpdatedEmployee(departmentId)))
  }

  assignEmployee(actionId: number, departmentId: number, employeeId: number) : Observable<Employee> {

    var actionIdString = actionId.toString()
    console.log(actionIdString);
    console.log(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId);

    return this.httpClient.post<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId, `"${actionIdString}"`, {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }

  getActions() : Observable<Action[]> {
    return this.httpClient.get<Action[]>(this.baseApiUrl + '/actions')
  }

  addAction(actionRequest: Action) : Observable<Action> {

    const addAction: AddActionRequest = {
      Longitude: actionRequest.lng,
      Latitude: actionRequest.lat
    }

    return this.httpClient.post<Action>(this.baseApiUrl + '/actions', addAction);
  }

  updateAction(actionId: number, actionRequest: Action) : Observable<Action> {

    const updateAction: UpdateActionRequest = {
      id: actionRequest.id,
      name: actionRequest.name,
      description: actionRequest.description
    }

    return this.httpClient.put<Action>(this.baseApiUrl + '/actions/' + actionId, updateAction);
  }

  deleteAction(actionId: number) : Observable<Action> {
    return this.httpClient.delete<Action>(this.baseApiUrl + '/actions/' + actionId);
  }

  callAfterUpdateEmployee(departmentId: number, employeeId: number) : Observable<Employee> {
    console.log(this.employeeRequest);

    return this.httpClient.put<Employee>(this.baseApiUrl + '/department/' + departmentId + '/employee/' + employeeId, this.employeeRequest);
  }

  updateEmployee(departmentId: number, employeeId: number, employeeRequest: Employee) : Observable<Employee> {

    this.employeeRequest = employeeRequest;
    console.log(this.employeeRequest);

    let employeeAddress = '';
    employeeAddress += this.employeeRequest.street + ", " + this.employeeRequest.city;
    var employee = this.geocodeEmployee({address: employeeAddress});

    return employee.pipe(tap(employeeResponse => this.setUpdatedEmployee(employeeResponse)),
      switchMap(_=>this.callAfterUpdateEmployee(departmentId, employeeId)));
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

  geocodeEmployee(request: google.maps.GeocoderRequest) : Observable<Employee>
  {
     const result = from(this.geocoder.geocode(request).then((result) => {

      const { results } = result;

      this.employeeRequest.lat = results[0].geometry.location.lat();
      this.employeeRequest.lng = results[0].geometry.location.lng();

      return this.employeeRequest;
    }));

    return result;
  }

  geocodeDepartment(request: google.maps.GeocoderRequest) : Observable<Department>
  {
     const result = from(this.geocoder.geocode(request).then((result) => {

      const { results } = result;

      this.departmentRequest.lat = results[0].geometry.location.lat();
      this.departmentRequest.lng = results[0].geometry.location.lng();

      return this.departmentRequest;
    }));

    return result;
  }
}
