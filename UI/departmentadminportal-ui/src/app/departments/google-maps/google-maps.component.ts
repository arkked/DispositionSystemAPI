import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/models/ui-models/department.model';
import { Employee } from 'src/app/models/ui-models/employee.model';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent {

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild(GoogleMap)
  public map!: GoogleMap;

  @Input() departments: Department[] = [];

  display: any;
  center: google.maps.LatLngLiteral = {lat: 50.63790500644537, lng: 18.842152396326448,};
  zoom = 14;
  mapOptions: google.maps.MapOptions = {
    mapId: "256d39975e98a98",
    zoomControl: true,
    disableDefaultUI: true,
    clickableIcons: false,
    disableDoubleClickZoom: true,
  }

  markerDepartmentOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: "./assets/department.png"
  }

  markerEmployeeOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: "./assets/User-yellow-icon.png"
  }

  markerDepartmentsPositions: google.maps.LatLng[] = [];
  markerEmployeesPositions: google.maps.LatLng[] = [];

  latitude!: any;
  longitude!: any;

  geocoder = new google.maps.Geocoder();
  marker = new google.maps.Marker();

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchElementRef.nativeElement);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();

        this.center = {
          lat: this.latitude,
          lng: this.longitude
        }
      });
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
  }

  ngOnChanges()
  {
      this.departments.forEach(department => {
        let departmentAddress = '';
        departmentAddress += department.street + ", " + department.postalCode + " " + department.city;

        console.log((department.employees as MatTableDataSource<Employee>).filteredData);

        (department.employees as MatTableDataSource<Employee>).filteredData.forEach(
          employee => {
            let employeeAddress = '';
            employeeAddress += employee.street + ", " + employee.postalCode + " " + employee.city;
            this.geocodeEmployees({address: employeeAddress})
          }
        )

        this.geocodeDepartments({address: departmentAddress});
     });


  }

  geocodeDepartments(request: google.maps.GeocoderRequest) : void {
    this.geocoder.geocode(request).then((result) => {
      const { results } = result;

      this.marker.setPosition(results[0].geometry.location);
      this.markerDepartmentsPositions.push(this.marker.getPosition() as google.maps.LatLng);

      return results;

    })
  }

  geocodeEmployees(request: google.maps.GeocoderRequest) : void {
    this.geocoder.geocode(request).then((result) => {
      const { results } = result;

      this.marker.setPosition(results[0].geometry.location);
      this.markerEmployeesPositions.push(this.marker.getPosition() as google.maps.LatLng);

      return results;

    })
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = (event.latLng.toJSON());
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.display = event.latLng.toJSON();
    }
  }
}
