import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { SupabaseService } from './../src/supabase.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const store = [
    {
      id: 1,
      name: 'Xander',
      message: 'Initial test message',
      created_at: '2026-02-25T10:00:00.000Z',
    },
  ];

  const mockSupabaseService = {
    checkConnection: jest.fn().mockResolvedValue({ connected: true }),
    getClient: jest.fn().mockReturnValue({
      from: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ data: [...store], error: null }),
              ),
          }),
        }),
        insert: jest
          .fn()
          .mockImplementation((rows: { name: string; message: string }[]) => {
            const created = {
              id: store.length + 1,
              name: rows[0].name,
              message: rows[0].message,
              created_at: new Date().toISOString(),
            };
            store.unshift(created);
            return {
              select: jest.fn().mockReturnValue({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: created, error: null }),
              }),
            };
          }),
      })),
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SupabaseService)
      .useValue(mockSupabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/health (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      supabase: { connected: true },
    });
  });

  it('/api/guestbook (GET & POST)', async () => {
    const initial = await request(app.getHttpServer())
      .get('/api/guestbook')
      .expect(200);
    expect(Array.isArray(initial.body)).toBe(true);

    const created = await request(app.getHttpServer())
      .post('/api/guestbook')
      .send({ name: 'Tester', message: 'Guestbook works!' })
      .expect(201);
    expect(created.body).toMatchObject({
      name: 'Tester',
      message: 'Guestbook works!',
    });

    await request(app.getHttpServer())
      .post('/api/guestbook')
      .send({ name: '   ', message: '' })
      .expect(400);
  });
});
