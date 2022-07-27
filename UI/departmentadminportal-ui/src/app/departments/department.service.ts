import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentCall } from '../models/api-models/departmentCall.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseApiUrl = 'https://localhost:5001/api';

  constructor(private httpClient: HttpClient) { }

  getAllDepartments(): Observable<DepartmentCall> {
    return this.httpClient.get<DepartmentCall>(this.baseApiUrl + '/department?pageSize=5&pageNumber=1');
  }


}
