import {
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Desk } from 'src/desk/desk.model';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { instrument } from '@socket.io/admin-ui';
import { DocumentDeskType } from 'src/utils/types';
import { deepClone } from 'src/utils/common/helpers';
import { DEFAULT_CURRENT } from 'src/utils/common/constants';
import { DeskType, PLAYER_STATUS } from 'src/utils/common/types';
import { HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { DEFAULT_ROUND, EVENTS, MESSAGES } from 'src/utils/common/constants';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000', // local
      'https://admin.socket.io/', // admin panel
      'https://dice-tan.vercel.app', // production
      'https://dice-synakv.vercel.app', // development
    ],
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
    this.server.on('connection', (socket: Socket) => {
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
      {
        $push: {
          'gameplay.players': {
            name,
            id: client.id,
            status: PLAYER_STATUS.ONLINE,
          },
        },
      },
      { new: true },
    );

    this.server
      .to(desk)
      .emit(EVENTS.ON_JOIN_DESK, this.getMessageBody(updatedDesk));
  }

  @SubscribeMessage(MESSAGES.START_GAME)
  async onStartGame(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server
        .to(desk._id)
        .emit(EVENTS.ON_START_GAME, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.START_THROW_DICE)
  async handleStartStage(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server
        .to(desk._id)
        .emit(EVENTS.ON_START_THROW_DICE, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.THROW_DICE)
  async handleThrowDice(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server
        .to(desk._id)
        .emit(EVENTS.ON_THROW_DICE, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.FINISH_THROW_DICE)
  async handleFinishThrowDice(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (!updatedDesk) {
      return;
    }

    this.server
      .to(updatedDesk.id)
      .emit(EVENTS.ON_FINISH_THROW_DICE, this.getMessageBody(updatedDesk));

    if (
      updatedDesk.gameplay.rounds[updatedDesk.gameplay.current.round]
        .isCompleted
    ) {
      this.handleFinishStageAfterCloseConclusion(_, updatedDesk);
    }
  }

  @SubscribeMessage(MESSAGES.SELECT_DICE)
  async handleselectDice(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (updatedDesk) {
      this.server
        .to(updatedDesk.id)
        .emit(EVENTS.ON_SELECT_DICE, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.CLOSE_CONCLUSION)
  async handleCloseConclusion(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    setTimeout(() => {
      if (!updatedDesk) {
        return;
      }

      if (updatedDesk.gameplay.isLastRound) {
        this.handleEndGameAfterCloseConclusion(_, updatedDesk);
      } else {
        this.server
          .to(updatedDesk.id)
          .emit(EVENTS.ON_CLOSE_CONCLUSION, this.getMessageBody(updatedDesk));
      }
    }, 5000);
  }

  @SubscribeMessage(MESSAGES.END_GAME)
  async handleEndGame(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server
        .to(desk._id)
        .emit(EVENTS.ON_END_GAME, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.CHANGE_SETTINGS)
  async handleChangeSettings(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server
        .to(desk._id)
        .emit(EVENTS.ON_CHANGE_SETTINGS, this.getMessageBody(updatedDesk));
    }
  }

  @SubscribeMessage(MESSAGES.LEAVE_DESK)
  async handleLeaveDesk(client: Socket) {
    const room = client.data.room;

    client.leave(room);

    const desk = await this.deskModel.findById(room);

    let updatedDesk;

    if (desk?.gameplay.isGameStarted) {
      updatedDesk = await this.deskModel.findOneAndUpdate(
        { _id: room, 'gameplay.players.id': client.id },
        { $set: { 'gameplay.players.$.status': PLAYER_STATUS.OFFLINE } },
        { new: true },
      );
    } else {
      updatedDesk = await this.deskModel.findOneAndUpdate(
        { _id: room },
        { $pull: { 'gameplay.players': { id: client.id } } },
        { new: true },
      );
    }

    client
      .to(room)
      .emit(EVENTS.ON_LEAVE_DESK, this.getMessageBody(updatedDesk));
  }

  async handleFinishStageAfterCloseConclusion(
    _: Socket,
    updatedDesk: DocumentDeskType,
  ) {
    this.handleCloseConclusion(_, {
      ...updatedDesk,
      _id: updatedDesk._id.toString(),
      gameplay: {
        ...updatedDesk.gameplay,
        isShowConclusion: false,
        rounds: [...updatedDesk.gameplay.rounds, deepClone(DEFAULT_ROUND)],
        current: {
          ...updatedDesk.gameplay.current,
          round: updatedDesk.gameplay.current.round + 1,
          stage: 0,
        },
      },
    });
  }

  async handleEndGameAfterCloseConclusion(
    _: Socket,
    updatedDesk: DocumentDeskType,
  ) {
    this.handleEndGame(_, {
      ...updatedDesk,
      _id: updatedDesk._id.toString(),
      gameplay: {
        ...updatedDesk.gameplay,
        isLastRound: false,
        isGameEnded: false,
        isGameStarted: false,
        isShowConclusion: false,
        rounds: [deepClone(DEFAULT_ROUND)],
        current: deepClone(DEFAULT_CURRENT),
      },
    });
  }

  getMessageBody(body: DocumentDeskType | null) {
    if (body) {
      return body;
    } else {
      return new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
