import { Employee } from "./employee.model";

export interface Department {
  id: number,
  name: string,
  description: string,
  category: string,
  city: string,
  street: string,
  postalCode: string,
  imageUrl: string,
  employees: Employee[];
}
