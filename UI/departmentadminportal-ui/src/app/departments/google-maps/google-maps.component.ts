import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ICON_REGISTRY_PROVIDER } from '@angular/material/icon';
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

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

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
     let i = 1;
     let j = 1;
     this.departments.forEach(department => {
        let departmentAddress = '';
        departmentAddress += department.street + ", " + department.postalCode + " " + department.city;

        if (department.employees) {
          (department.employees as MatTableDataSource<Employee>).filteredData.forEach(
            employee => {
              let employeeAddress = '';
              employeeAddress += employee.street + ", " + employee.postalCode + " " + employee.city;
              this.geocodeEmployees({address: employeeAddress}, this.geocoder, this.markerEmployeesPositions, j);
              j++
            }
          )
        }

        i++;
        this.geocodeDepartments({address: departmentAddress}, this.geocoder, this.markerDepartmentsPositions, i);
     });


  }

  geocodeDepartments(request: google.maps.GeocoderRequest, geocoder: google.maps.Geocoder, markerPositions: google.maps.LatLng[], i: number) : void {
    setTimeout(function() {
      let marker = new google.maps.Marker();
      geocoder.geocode(request).then((result) => {
      const { results } = result;

      marker.setPosition(results[0].geometry.location);
      markerPositions.push(marker.getPosition() as google.maps.LatLng);

      return results;

    })
  }, 500 * i)
  }

  geocodeEmployees(request: google.maps.GeocoderRequest, geocoder: google.maps.Geocoder, markerPositions: google.maps.LatLng[], j: number) : void {

    setTimeout(function() {
      let marker = new google.maps.Marker();
      geocoder.geocode(request).then((result) => {
      const { results } = result;

      marker.setPosition(results[0].geometry.location);
      markerPositions.push(marker.getPosition() as google.maps.LatLng);

      return results;

      });
    }, 500 * j)
  }


  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
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
