import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DeskModule } from 'src/desk/desk.module';
import { AppController } from 'src/app.controller';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    GatewayModule,
    DeskModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_COLLECTION}.hri12ns.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
