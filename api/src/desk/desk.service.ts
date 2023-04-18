import { Model } from 'mongoose';
import { Desk } from './desk.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DEFAULT_DESK } from 'src/utils/common/constants';

@Injectable()
export class DeskService {
  constructor(@InjectModel('Desk') private readonly deskModel: Model<Desk>) {}

  async findAll(): Promise<Desk[]> {
    return this.deskModel.find().exec();
  }

  async findOne(id: string): Promise<Desk | null> {
    const desk = await this.deskModel.findById(id);

    if (desk) {
      return desk;
    } else {
      return null;
    }
  }

  async create(body: any): Promise<Desk | null> {
    const { name, creator, wins, players, stages } = body;

    const existedDesk = await this.deskModel.findOne({ name });

    if (existedDesk) {
      return null;
    } else {
      const createDesk = new this.deskModel({
        ...DEFAULT_DESK,
        name,
        creator,
        gameplay: {
          ...DEFAULT_DESK.gameplay,
          max: {
            wins,
            stages,
            players,
          },
        },
      });

      createDesk.save();

      return createDesk;
    }
  }
}
