import { Model } from 'mongoose';
import { Desk } from './desk.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DeskService {
  constructor(@InjectModel('Desk') private readonly deskModel: Model<Desk>) {}

  async findAll(): Promise<Desk[]> {
    return this.deskModel.find().exec();
  }

  async findOne(id: string): Promise<Desk> {
    const desk = await this.deskModel.findById(id);

    if (desk) {
      return desk;
    } else {
      return {};
    }
  }

  async createDesk(body: any): Promise<Desk> {
    const { name, creator, players } = body;

    const existedDesk = await this.deskModel.findOne({ name });

    if (existedDesk) {
      return {};
    } else {
      const createdDesk = new this.deskModel({
        name,
        creator,
        isGameStarted: false,
        gameplay: {
          max: {
            players,
          },
          players: [creator],
        },
      });

      createdDesk.save();

      return createdDesk;
    }
  }
}
