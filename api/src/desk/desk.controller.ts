import { DeskService } from 'src/desk/desk.service';
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
    return this.deskService.create(req.body);
  }
}
