import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseKey = (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_ANON_KEY
    )?.trim();

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'Supabase credentials not found. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY).',
      );
      return;
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      throw new ServiceUnavailableException(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.',
      );
    }

    return this.client;
  }

  async checkConnection(): Promise<{ connected: boolean; error?: string }> {
    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      return {
        connected: false,
        error: 'Missing SUPABASE_URL or SUPABASE_KEY environment variables.',
      };
    }

    try {
      const { error } = await this.client
        .from('guestbook')
        .select('id', { head: true, count: 'exact' })
        .limit(1);

      if (error) {
        return { connected: false, error: error.message };
      }

      return { connected: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown connection error';
      return { connected: false, error: message };
    }
  }
}
