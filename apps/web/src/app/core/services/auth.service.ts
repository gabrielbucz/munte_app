
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseKey = 'placeholder-key';

const DOMINIO_INSTITUCIONAL = '@utfpr.edu.br';

export class AuthService {
  private readonly supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  async requestMagicLink(email: string): Promise<void> {
    if (!email.toLowerCase().endsWith(DOMINIO_INSTITUCIONAL)) {
      throw new Error('e-mail não permitido: somente e-mails institucionais @utfpr.edu.br');
    }

    const { error } = await this.supabase.auth.signInWithOtp({ email });

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async verifyOtp(params: { email?: string; token?: string; token_hash?: string; type: 'email' }) {
    return this.supabase.auth.verifyOtp(params);
  }
}
