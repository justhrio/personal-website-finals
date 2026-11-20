import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';

// Function group: GuestbookEntry & validation constants — shared shape and query bounds for AppService
export interface GuestbookEntry {
  id: number | string;
  name: string;
  message: string;
  created_at: string;
}

const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  // Function group: AppService.getHealth — checks Supabase connectivity and returns service health payload
  async getHealth() {
    const supabase = await this.supabaseService.checkConnection();
    return {
      status: supabase.connected ? 'ok' : 'degraded',
      supabase,
      timestamp: new Date().toISOString(),
    };
  }

  // Function group: AppService.getComments — clamps query limit and prepares Supabase client
  async getComments(limit = DEFAULT_LIMIT): Promise<GuestbookEntry[]> {
    const safeLimit = Math.min(
      Math.max(Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const supabase = this.supabaseService.getClient();

    // Function group: AppService.getComments — fetches newest guestbook entries and maps Supabase/network errors
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false })
        .limit(safeLimit);

      if (error) {
        this.logger.error(`Supabase getComments failed: ${error.message}`);
        throw new InternalServerErrorException(
          'Failed to load guestbook comments from Supabase.',
        );
      }

      return (data as GuestbookEntry[]) ?? [];
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Unexpected error fetching comments: ${message}`);
      throw new ServiceUnavailableException(
        'Unable to reach Supabase right now. Check SUPABASE_URL and network access.',
      );
    }
  }

  // Function group: AppService.addComment — trims and validates visitor name and message inputs
  async addComment(name: string, message: string): Promise<GuestbookEntry> {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (!cleanName) {
      throw new BadRequestException('Name is required.');
    }
    if (cleanName.length > MAX_NAME_LENGTH) {
      throw new BadRequestException(
        `Name must be ${MAX_NAME_LENGTH} characters or fewer.`,
      );
    }
    if (!cleanMessage) {
      throw new BadRequestException('Message is required.');
    }
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      throw new BadRequestException(
        `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      );
    }

    const supabase = this.supabaseService.getClient();

    // Function group: AppService.addComment — inserts validated comment into Supabase and returns the created row
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .insert([{ name: cleanName, message: cleanMessage }])
        .select('id, name, message, created_at')
        .single();

      if (error) {
        this.logger.error(`Supabase addComment failed: ${error.message}`);
        throw new InternalServerErrorException(
          'Failed to save guestbook comment to Supabase.',
        );
      }

      return data as GuestbookEntry;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Unexpected error adding comment: ${errMsg}`);
      throw new ServiceUnavailableException(
        'Unable to reach Supabase right now. Check SUPABASE_URL and network access.',
      );
    }
  }
}
