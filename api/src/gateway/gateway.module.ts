import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayService } from 'src/gateway/gateway';
import { Desk, DeskSchema } from 'src/desk/desk.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
  ],
  providers: [GatewayService],
})
export class GatewayModule {}
