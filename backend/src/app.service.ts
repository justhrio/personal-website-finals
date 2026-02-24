import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private supabase: SupabaseClient;

  constructor() {
    // We will replace these with your actual keys shortly
    const supabaseUrl = process.env.SUPABASE_URL || 'https://grpleufvicotavmmlzaa.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycGxldWZ2aWNvdGF2bW1semFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDA4NzksImV4cCI6MjA4NDY3Njg3OX0.rPixLAIz0moFzuA8Ou_vVaNftNZLL51sq5s8StKVBsQ';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getComments() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async addComment(name: string, message: string) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([{ name, message }])
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
}