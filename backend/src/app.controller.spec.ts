import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './supabase.service';

describe('AppController', () => {
  let appController: AppController;
  let mockSelectChain: {
    order: jest.Mock;
    limit: jest.Mock;
  };
  let mockInsertChain: {
    select: jest.Mock;
    single: jest.Mock;
  };
  let mockSupabaseClient: {
    from: jest.Mock;
  };
  let mockSupabaseService: {
    getClient: jest.Mock;
    checkConnection: jest.Mock;
  };

  beforeEach(async () => {
    mockSelectChain = {
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'Xander',
            message: 'Welcome to my portfolio!',
            created_at: '2026-02-25T10:00:00.000Z',
          },
        ],
        error: null,
      }),
    };

    mockInsertChain = {
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 2,
          name: 'Visitor',
          message: 'Nice guitar!',
          created_at: '2026-02-25T10:05:00.000Z',
        },
        error: null,
      }),
    };

    mockSupabaseClient = {
      from: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnValue(mockSelectChain),
        insert: jest.fn().mockReturnValue(mockInsertChain),
      })),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
      checkConnection: jest.fn().mockResolvedValue({ connected: true }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('returns ok status when Supabase is connected', async () => {
      const result = await appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.supabase).toEqual({ connected: true });
    });
  });

  describe('guestbook', () => {
    it('returns guestbook comments ordered from Supabase', async () => {
      const comments = await appController.getComments();
      expect(comments).toHaveLength(1);
      expect(comments[0].name).toBe('Xander');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('guestbook');
      expect(mockSelectChain.limit).toHaveBeenCalledWith(50);
    });

    it('trims and saves a valid comment', async () => {
      const saved = await appController.addComment({
        name: '  Visitor  ',
        message: '  Nice guitar!  ',
      });
      expect(saved).toMatchObject({
        id: 2,
        name: 'Visitor',
        message: 'Nice guitar!',
      });
    });

    it('rejects empty name or message with BadRequestException', async () => {
      await expect(
        appController.addComment({ name: '   ', message: 'Hello' }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        appController.addComment({ name: 'Alice', message: '   ' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('propagates ServiceUnavailableException when Supabase is not configured', async () => {
      mockSupabaseService.getClient.mockImplementation(() => {
        throw new ServiceUnavailableException('Supabase not configured');
      });

      await expect(appController.getComments()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
