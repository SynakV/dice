import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeskService } from 'src/desk/desk.service';
import { Desk, DeskSchema } from 'src/desk/desk.model';
import { DeskController } from 'src/desk/desk.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
  ],
  providers: [DeskService],
  controllers: [DeskController],
})
export class DeskModule {}
