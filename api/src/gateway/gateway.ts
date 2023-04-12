import {
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Timers } from 'src/utils/types';
import { Desk } from '../desk/desk.model';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { instrument } from '@socket.io/admin-ui';
import { deepClone } from 'src/utils/common/helpers';
import { DEFAULT_ROUND } from 'src/utils/common/constants';
import { DEFAULT_CURRENT } from 'src/utils/common/constants';
import { MESSAGES, EVENTS, DeskType } from '../utils/common/types';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://admin.socket.io/',
      'https://dice-tan.vercel.app',
    ],
  },
})
export class GatewayService implements OnModuleInit {
  constructor(@InjectModel('Desk') private readonly deskModel: Model<Desk>) {}

  private readonly timers: Timers = {};

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
      { $push: { 'gameplay.players': { id: client.id, name: name } } },
      { new: true },
    );

    this.server.to(desk).emit(EVENTS.ON_JOIN_DESK, updatedDesk);
  }

  @SubscribeMessage(MESSAGES.START_GAME)
  async onStartGame(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server.to(desk._id).emit(EVENTS.ON_START_GAME, updatedDesk);
    }
  }

  @SubscribeMessage(MESSAGES.START_STAGE)
  async handleStartStage(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (desk._id) {
      this.server.to(desk._id).emit(EVENTS.ON_START_STAGE, updatedDesk);
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
      this.server.to(desk._id).emit(EVENTS.ON_THROW_DICE, updatedDesk);
    }
  }

  @SubscribeMessage(MESSAGES.FINISH_STAGE)
  async handleFinishStage(_: Socket, desk: DeskType) {
    const updatedDesk = await this.deskModel.findOneAndUpdate(
      { _id: desk._id },
      { $set: { gameplay: desk.gameplay } },
      { new: true },
    );

    if (!updatedDesk) {
      return;
    }

    this.server.to(updatedDesk.id).emit(EVENTS.ON_FINISH_STAGE, updatedDesk);

    if (
      updatedDesk.gameplay.rounds[updatedDesk.gameplay.current.round]
        .isCompleted
    ) {
      this.handleFinishStageAfterCloseConclusion(_, {
        ...updatedDesk,
        _id: desk._id,
      });
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
        this.handleEndGameAfterCloseConclusion(_, {
          ...updatedDesk,
          _id: desk._id,
        });
      } else {
        this.server
          .to(updatedDesk.id)
          .emit(EVENTS.ON_CLOSE_CONCLUSION, updatedDesk);
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
      this.server.to(desk._id).emit(EVENTS.ON_END_GAME, updatedDesk);
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
      this.server.to(desk._id).emit(EVENTS.ON_CHANGE_SETTINGS, updatedDesk);
    }
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

  async handleEndGameAfterCloseConclusion(_: Socket, updatedDesk: DeskType) {
    this.handleEndGame(_, {
      ...updatedDesk,
      _id: updatedDesk._id,
      gameplay: {
        ...updatedDesk.gameplay,
        isLastRound: false,
        isGameEnded: false,
        isGameStarted: false,
        isShowConclusion: false,
        rounds: [deepClone(DEFAULT_ROUND)],
        current: {
          ...deepClone(DEFAULT_CURRENT),
          player: updatedDesk.gameplay.players[0],
        },
      },
    });
  }

  async handleFinishStageAfterCloseConclusion(
    _: Socket,
    updatedDesk: DeskType,
  ) {
    this.handleCloseConclusion(_, {
      ...updatedDesk,
      _id: updatedDesk._id,
      gameplay: {
        ...updatedDesk.gameplay,
        isShowConclusion: false,
        rounds: [...updatedDesk.gameplay.rounds, deepClone(DEFAULT_ROUND)],
        current: {
          ...updatedDesk.gameplay.current,
          round: updatedDesk.gameplay.current.round + 1,
          stage: 0,
          status: '',
        },
      },
    });
  }
}
