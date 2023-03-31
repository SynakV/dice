import { DeskService } from './desk.service';
import { Controller, Get, Param, Post, Req } from '@nestjs/common';

@Controller('desk')
export class DeskController {
  constructor(private deskService: DeskService) {}

  @Get()
  getDesks() {
    return this.deskService.findAll();
  }

  @Get(':id')
  getDesk(@Param() param: any) {
    return this.deskService.findOne(param.id);
  }

  @Post()
  createDesk(@Req() req: any) {
    return this.deskService.createDesk(req.body);
  }
}
