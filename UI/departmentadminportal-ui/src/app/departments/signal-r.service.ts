import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { NotificationModel } from '../models/api-models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public data: Notification[] = [];

  private hubConnection!: signalR.HubConnection;

  token: string | null= localStorage.getItem("jwt");

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

    })
  }
}
