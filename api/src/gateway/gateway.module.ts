import { Module } from '@nestjs/common';
import { GatewayService } from './gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Desk, DeskSchema } from '../desk/desk.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
  ],
  providers: [GatewayService],
})
export class GatewayModule {}
