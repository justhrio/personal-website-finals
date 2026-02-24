import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/guestbook')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getComments() {
    return await this.appService.getComments();
  }

  @Post()
  async addComment(@Body() body: { name: string; message: string }) {
    return await this.appService.addComment(body.name, body.message);
  }
}