import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-marker-info',
  templateUrl: './marker-info.component.html',
  styleUrls: ['./marker-info.component.css']
})
export class MarkerInfoComponent implements OnInit {

  constructor() { }

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  ngOnInit(): void {
  }

  openInfoWindow(marker: MapMarker){
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
  }
}
