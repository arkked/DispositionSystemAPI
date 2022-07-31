import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/api-models/department.model';


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
}
