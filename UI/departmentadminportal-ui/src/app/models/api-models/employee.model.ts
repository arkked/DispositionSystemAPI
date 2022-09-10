export interface Employee {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  city: string,
  street: string,
  postalCode: string,
  lat: number,
  lng: number,
  profileImageUrl: string,
  actionId: number | undefined
}
