import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

// Function group: AppController — HTTP route handlers under /api
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Function group: AppController.getHealth — handles GET /api/health
  @Get('health')
  async getHealth() {
    return await this.appService.getHealth();
  }

  // Function group: AppController.getComments — handles GET /api/guestbook with optional limit
  @Get('guestbook')
  async getComments(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    return await this.appService.getComments(parsedLimit);
  }

  // Function group: AppController.addComment — handles POST /api/guestbook comment submission
  @Post('guestbook')
  async addComment(@Body() body?: { name?: string; message?: string }) {
    return await this.appService.addComment(
      body?.name ?? '',
      body?.message ?? '',
    );
  }
}
