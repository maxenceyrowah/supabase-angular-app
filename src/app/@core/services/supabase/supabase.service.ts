import { Injectable } from '@angular/core';

import {
  AuthResponse,
  SupabaseClient,
  UserResponse,
  createClient,
} from '@supabase/supabase-js';

import { environment } from 'src/environments/environment.development';
import { Iregister } from '../../models/register';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  register(data: Iregister): Promise<AuthResponse> {
    return this.supabase.auth.signUp(data);
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  forgotPasswordWithEmail(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:4200/public/reset-password',
    });
  }
  resetPassword(password: string): Promise<UserResponse> {
    return this.supabase.auth.updateUser({ password });
  }
}
