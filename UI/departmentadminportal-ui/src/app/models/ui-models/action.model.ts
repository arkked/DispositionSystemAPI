import { MatTableDataSource } from "@angular/material/table";
import { Employee } from "./employee.model";

export interface Action {

  id: number,
  name: string,
  lat: number,
  lng: number,
  employees?: Employee[] | MatTableDataSource<Employee>;

}
