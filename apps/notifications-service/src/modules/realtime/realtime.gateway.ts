import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // Optionally associate user rooms using query/auth in the future
    // For MVP, we just accept the connection
  }

  handleDisconnect(client: Socket) {
    // Cleanup if needed
  }

  emit(event: string, payload: unknown) {
    if (this.server) {
      this.server.emit(event, payload);
    }
  }
}
