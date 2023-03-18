import { DeskService } from './desk.service';
import { Controller, Get, Post, Req } from '@nestjs/common';

@Controller('desk')
export class DeskController {
  constructor(private deskService: DeskService) {}

  @Post()
  createDesk(@Req() req: any) {
    return this.deskService.createDesk(req.body);
  }

  @Get()
  getDesks() {
    return this.deskService.findAll();
  }
}
