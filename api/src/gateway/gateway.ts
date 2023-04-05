import {
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Desk } from '../desk/desk.model';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { instrument } from '@socket.io/admin-ui';
import { MESSAGES, EVENTS, PlayerType, DeskType } from '../utils/common/types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io/'],
  },
})
export class GatewayService implements OnModuleInit {
  constructor(@InjectModel('Desk') private readonly deskModel: Model<Desk>) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  onModuleInit() {
    this.server.on(EVENTS.CONNECTION, (socket: Socket) => {
      socket.on('disconnect', () => {
        this.handleLeaveDesk(socket);
        console.warn(
          `Disconected: ID: ${socket.id}; ROOM: ${socket.data.room}`,
        );
      });
      console.warn('Connected', socket.id);
    });
  }

  @SubscribeMessage(MESSAGES.JOIN_DESK)
  async handleJoinDesk(
    client: Socket,
    { desk, name }: { desk: string; name: string },
  ) {
    client.join(desk);
    client.data.room = desk;

    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk },
      { $push: { 'gameplay.players': { id: client.id, name: name } } },
      { new: true },
    );

    this.server.to(desk).emit(EVENTS.ON_JOIN_DESK, updatedDesk);
  }

  @SubscribeMessage(MESSAGES.LEAVE_DESK)
  async handleLeaveDesk(client: Socket) {
    const room = client.data.room;

    client.leave(room);

    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: room },
      { $pull: { 'gameplay.players': { id: client.id } } },
      { new: true },
    );

    client.to(room).emit(EVENTS.ON_LEAVE_DESK, updatedDesk);
  }

  @SubscribeMessage(MESSAGES.DESK_CHANGE)
  async handleDeskChange(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server.to(desk._id).emit(EVENTS.ON_JOIN_DESK, updatedDesk);
    }
  }

  @SubscribeMessage(MESSAGES.GAME_START)
  async onGameStart(
    @MessageBody() { desk, sequence }: { desk: string; sequence: PlayerType[] },
  ) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk },
      { $set: { 'players.sequence': sequence, isGameStarted: true } },
      { new: true },
    );

    this.server.to(desk).emit(EVENTS.ON_GAME_START, updatedDesk);
  }
}
