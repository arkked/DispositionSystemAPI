import { Department } from "./department.model";

export interface DepartmentCall {
  items: Department[],
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  totalPages: number
}
