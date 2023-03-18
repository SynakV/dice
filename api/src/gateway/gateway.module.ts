import { Gateway } from './gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [Gateway],
})
export class GatewayModule {}
