import { Module } from '@nestjs/common';
import { DeskService } from './desk.service';
import { Desk, DeskSchema } from './desk.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DeskController } from './desk.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
  ],
  providers: [DeskService],
  controllers: [DeskController],
})
export class DeskModule {}
