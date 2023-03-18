import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MESSAGES, EVENTS } from '../utils/common/types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on(EVENTS.CONNECTION, (socket) => {
      // console.log(socket.id);
      // console.log('Connected');
    });
  }

  @SubscribeMessage(MESSAGES.NEW_MESSAGE)
  onNewMessage(@MessageBody() body: any) {
    // console.log(body);
    this.server.emit(EVENTS.ON_MESSAGE, {
      msg: 'New mesage',
      content: body,
    });
  }
}
