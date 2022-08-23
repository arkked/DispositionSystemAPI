import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-info-window',
  templateUrl: './map-info-window.component.html',
  styleUrls: ['./map-info-window.component.css']
})
export class MapInfoWindowComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  center: google.maps.LatLngLiteral = {lat: 52.91722430065678, lng: 18.792917547308};
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 6;

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
    }
  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
  }
}
