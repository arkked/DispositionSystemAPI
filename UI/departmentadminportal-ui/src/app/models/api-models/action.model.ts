import { Employee } from "./employee.model";

export interface Action {

  id: number,
  name: string,
  description: string,
  lat: number,
  lng: number,
  employees?: Employee[];

}
