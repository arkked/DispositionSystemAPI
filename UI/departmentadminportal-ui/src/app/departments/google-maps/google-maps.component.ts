import { Component, ElementRef, Input, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { Action } from 'src/app/models/api-models/action.model';
import { Department } from 'src/app/models/ui-models/department.model';
import { Employee } from 'src/app/models/ui-models/employee.model';
import { ActionMarker } from 'src/app/models/ui-models/marker-action.model';
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

  @ViewChildren(MapInfoWindow) employeeInfoWindow?: QueryList<MapInfoWindow>;
  @ViewChildren(MapInfoWindow) actionInfoWindow?: QueryList<MapInfoWindow>;

  @Input() departments: Department[] = [];
  actions: Action[] = [];
  actionName?: string;

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
  markerActionsPositions: ActionMarker[] = [];

  latitude!: any;
  longitude!: any;

  geocoder = new google.maps.Geocoder();
  displayProfileImageUrl: string = '';

  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    street: '',
    postalCode: '',
    profileImageUrl: '',
    distance: 0,
    lat: 0,
    lng: 0,
    actionId: 0
  }

  constructor(private ngZone: NgZone, private departmentService: DepartmentService,
    private snackbar: MatSnackBar, private authService: AuthService,
    private toastr: ToastrService) {}

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
    this.authService.isUserAuthenticated();

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });

    this.departmentService.getActions().subscribe(
      data => {
        data.forEach(action => {
          let position =
          {
            actionId: action.id,
            name: action.name,
            description: action.description,
            position: new google.maps.LatLng(action.lat,action.lng)

          }

          this.markerActionsPositions.push(position);
        })
      }
    );
  }

  ngOnChanges()
  {
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
                    profileImgPath: employee.profileImageUrl ? this.departmentService.getImagePath(employee.profileImageUrl) : '/assets/default-user.png',
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                  }

                  this.markerEmployeesPositions.push(markerPosition);
                }
              )
            }

          this.markerDepartmentsPositions.push(new google.maps.LatLng(department.lat, department.lng));
     });
  }

  openEmployeeInfoWindow(marker: MapMarker, index: number) {
    let i = 0;
    this.employeeInfoWindow!.forEach((window: MapInfoWindow) => {
      if (index === i) {
        window.open(marker);
        i++;
      }
      else {
        i++;
      }
    });
  }

  openActionInfoWindow(marker: MapMarker, index: number, action: MapInfoWindow) {
    let i = 0;

    this.actionInfoWindow?.forEach(() => {
      if (index === i) {
        action.open(marker);
        i++;
      }
      else {
        i++;
      }
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {

      let action: Action = {
        id: 0,
        name: '',
        description: '',
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }

      this.departmentService.addAction(action)
        .subscribe((successResponse) => {
          this.snackbar.open('Action has been created', undefined, {
            duration: 2000
          });

        })

      this.departmentService.getActions().subscribe(
        (successResponse) => {

          action = successResponse[successResponse.length - 1]
          let position = {
            actionId: action.id,
            name: action.name,
            description: action.description,
            position: new google.maps.LatLng(action.lat, action.lng)
          }

          this.markerActionsPositions.push(position);
        })
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

  onUpdate(actionId: number) {

    var actionName = (<HTMLInputElement>document.getElementById("actionName")).value
    var actionDescription = (<HTMLInputElement>document.getElementById("actionDescription")).value

    if (typeof actionName !== 'undefined') {
      this.actionName = actionName

      let action = {
        id: actionId,
        name: actionName,
        description: actionDescription,
        lat: 0,
        lng: 0
      }
      console.log(action);

      this.departmentService.updateAction(actionId, action)
        .subscribe((successResponse) => {
          this.snackbar.open('Action has been modified', undefined, {
            duration: 2000
          })
        })
    }
    else {
      this.actionName = undefined;
    }
  }

  onDelete(actionId: number) : void {
    this.departmentService.deleteAction(actionId)
      .subscribe((successResponse) => {

        this.snackbar.open('Action has been deleted', undefined, {
          duration: 2000
        })

        let action;
        this.markerActionsPositions.forEach(marker => {
          if (marker.actionId == actionId){
            action = marker;
          }
        })

        if(action) {
          let index = this.markerActionsPositions.indexOf(action);
          this.markerActionsPositions.splice(index, 1);
        }

      },
      (errorResponse) => {
        console.log(errorResponse);
        this.toastr.error("You have to unassign employees first");
      })
  }
}
