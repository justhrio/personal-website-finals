import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async getHealth() {
    return await this.appService.getHealth();
  }

  @Get('guestbook')
  async getComments(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    return await this.appService.getComments(parsedLimit);
  }

  @Post('guestbook')
  async addComment(@Body() body?: { name?: string; message?: string }) {
    return await this.appService.addComment(
      body?.name ?? '',
      body?.message ?? '',
    );
  }
}
