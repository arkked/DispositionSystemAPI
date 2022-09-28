import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { NotificationModel } from '../models/api-models/notification.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public data: NotificationModel[] = [];

  private hubConnection!: signalR.HubConnection;

  token: string | null= localStorage.getItem("jwt");

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  options: signalR.IHttpConnectionOptions = {
    accessTokenFactory: () => {
      return this.token as string;
    }
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/notifications', this.options)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection', err))

  }

  public addTransferNotificationDataListener = () => {
    this.hubConnection.on('SendNotification', (message: NotificationModel) => {
      console.log(message);
      this.toastr.info("You have been assigned to action recently");
      this.data.push(message);

    })
  }

  public getNotifications(userId: number) {
    console.log(this.data);

    return this.httpClient.get<NotificationModel[]>('https://localhost:5001/api/notifications/' + userId);
  }
}
