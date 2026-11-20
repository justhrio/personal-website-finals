import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Function group: SupabaseService — manages the singleton stateless Supabase client
@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  // Function group: SupabaseService.constructor — initializes the Supabase client on service startup
  constructor() {
    this.initClient();
  }

  // Function group: SupabaseService.initClient — reads SUPABASE_URL and key from environment variables
  private initClient(): void {
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseKey = (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_ANON_KEY
    )?.trim();

    // Function group: SupabaseService.initClient — warn and skip client creation if credentials are missing
    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'Supabase credentials not found. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY).',
      );
      return;
    }

    // Function group: SupabaseService.initClient — creates stateless server-side Supabase client
    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  // Function group: SupabaseService.isConfigured — reports whether a Supabase client was initialized
  isConfigured(): boolean {
    return this.client !== null;
  }

  // Function group: SupabaseService.getClient — returns the active Supabase client or throws 503 if unconfigured
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

  // Function group: SupabaseService.checkConnection — verifies database reachability for /api/health
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

    // Function group: SupabaseService.checkConnection — performs lightweight HEAD query on guestbook table
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
