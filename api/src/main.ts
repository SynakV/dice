import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
