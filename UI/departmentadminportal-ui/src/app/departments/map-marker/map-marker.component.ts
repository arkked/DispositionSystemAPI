import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.css']
})
export class MapMarkerComponent {

  constructor() { }

  center: google.maps.LatLngLiteral = {lat: 52.91722430065678, lng: 18.792917547308};
  zoom = 6;

  markerOptions: google.maps.MarkerOptions = {draggable: false}
  markerPositions: google.maps.LatLngLiteral[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
    }
  }
}
