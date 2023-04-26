import { Model } from 'mongoose';
import { Desk } from 'src/desk/desk.model';
import { ErrorType } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { DEFAULT_DESK } from 'src/utils/common/constants';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DeskService {
  constructor(@InjectModel('Desk') private readonly deskModel: Model<Desk>) {}

  async findAll(): Promise<Desk[]> {
    return this.deskModel.find().exec();
  }

  async findOne(id: string): Promise<Desk | HttpException> {
    const desk = await this.deskModel.findById(id);

    if (desk) {
      return desk;
    } else {
      return new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async create(body: any): Promise<Desk | ErrorType> {
    const { name, wins, players, stages } = body;

    const existedDesk = await this.deskModel.findOne({ name });

    if (existedDesk) {
      return {
        error: 'Desk with such name already exists',
      };
    } else {
      const createDesk = new this.deskModel({
        ...DEFAULT_DESK,
        name,
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
