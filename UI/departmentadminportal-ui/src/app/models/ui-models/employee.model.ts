export interface Employee {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  city: string,
  street: string,
  postalCode: string,
  profileImageUrl: string,
  distance: number,
  lat: number,
  lng: number,
  actionId: number | undefined;
}
