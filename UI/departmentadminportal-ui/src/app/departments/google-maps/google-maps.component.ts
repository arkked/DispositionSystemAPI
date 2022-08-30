import { Component, ElementRef, Input, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ICON_REGISTRY_PROVIDER } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/models/ui-models/department.model';
import { Employee } from 'src/app/models/ui-models/employee.model';
import { MarkerEmployee } from 'src/app/models/ui-models/marker.model';
import { DepartmentService } from '../department.service';

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

  @ViewChildren(MapInfoWindow) infoWindow?: QueryList<MapInfoWindow>;

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

  markerActionOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: "./assets/action.png"
  }

  markerDepartmentsPositions: google.maps.LatLng[] = [];
  markerEmployeesPositions: MarkerEmployee[] = [];
  markerActionsPositions: google.maps.LatLng[] = [];

  latitude!: any;
  longitude!: any;

  geocoder = new google.maps.Geocoder();
  displayProfileImageUrl: string = '';

  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    postalCode: '',
    profileImageUrl: '',
    lat: 0,
    lng: 0
  }

  constructor(private ngZone: NgZone, private departmentService: DepartmentService) { }

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

        if ((department.employees as MatTableDataSource<Employee>).filteredData !== undefined &&
            (department.employees as MatTableDataSource<Employee>).filteredData.length !== undefined)
            {
              (department.employees as MatTableDataSource<Employee>).filteredData.forEach(
                employee => {

                  let markerPosition = {
                    employeeId: employee.id,
                    position: new google.maps.LatLng(employee.lat, employee.lng),
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                  }


                  this.markerEmployeesPositions.push(markerPosition);
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

  openInfoWindow(marker: MapMarker, index: number) {
    let i = 0;
    this.infoWindow?.forEach((window: MapInfoWindow) => {
      if (index === i) {
        window.open(marker);
        i++;
      }
      else {
        i++;
      }
    });
  }


  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerActionsPositions.push(event.latLng);
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
