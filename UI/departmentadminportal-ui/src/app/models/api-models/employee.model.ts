export interface Employee {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  city: string,
  street: string,
  postalCode: string,
  distance: number,
  lat: number,
  lng: number,
  profileImageUrl: string,
  actionId: number | undefined
}
