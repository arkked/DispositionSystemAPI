import { MatTableDataSource } from "@angular/material/table";
import { Employee } from "./employee.model";

export interface Department {
  id: number,
  name: string,
  description: string,
  category: string,
  city: string,
  street: string,
  postalCode: string,
  contactEmail: string,
  contactNumber: string,
  lat: number,
  lng: number,
  employees?: Employee[] | MatTableDataSource<Employee>;
}
