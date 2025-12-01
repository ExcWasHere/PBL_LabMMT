/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ namespace: 'analytics', cors: { origin: '*' } })
@Injectable()
export class AnalyticsGateway {
  @WebSocketServer()
  server: Server;

  broadcastTraffic(aggregatedData: any) {
    this.server.emit('traffic_update', aggregatedData);
  }
}
