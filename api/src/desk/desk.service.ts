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

  async createDesk(body: any): Promise<Desk> {
    const createdTab = new this.deskModel({
      name: body.name,
    });

    createdTab.save();

    return { name: body.name };
  }
}
