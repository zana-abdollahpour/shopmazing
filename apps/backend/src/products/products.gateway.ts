import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { AuthenticationService } from '@/src/iam/authentication/authentication.service.js';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ProductsGateway {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @WebSocketServer()
  private readonly server: Server;

  async handleConnection(client: Socket) {
    try {
      await this.authenticationService.verifyToken(
        client.handshake.auth.Authentication.value,
      );
    } catch (err) {
      throw new WsException('Unauthorized');
    }
  }

  handleProductUpdated() {
    this.server.emit('productUpdated');
  }
}
