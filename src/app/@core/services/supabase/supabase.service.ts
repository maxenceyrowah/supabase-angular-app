import { Injectable } from '@angular/core';

import {
  AuthError,
  AuthResponse,
  AuthSession,
  Session,
  SupabaseClient,
  UserResponse,
  createClient,
} from '@supabase/supabase-js';

import { environment } from 'src/environments/environment.development';
import { Iregister } from '../../models/register';
import { Router } from '@angular/router';

const AccesStorageKey = '__access__token';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private redirectTo: string = 'http://localhost:4200/public/reset-password';
  _session: AuthSession | null = null;
  private hasTokenExistMsg =
    'Impossible de se connecter. Veuillez vérifier les informations saisies.';

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }
  get isLoggedIn(): boolean {
    const keys = Object.keys(localStorage);
    const value = localStorage.getItem(keys?.[0]) as string;
    const accesToken = JSON.parse(value);
    return accesToken !== null;
  }

  register(data: Iregister): Promise<AuthResponse> {
    return this.supabase.auth.signUp(data);
  }

  logout(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    await this.supabase.auth.signInWithPassword({ email, password });

    const keys = Object.keys(localStorage);
    const value_1 = localStorage.getItem(keys?.[0]) as string;
    const accessToken = JSON.parse(value_1);

    if (!accessToken) {
      alert(this.hasTokenExistMsg);
      return;
    }
    this.router.navigate(['/dashboard/home']);
  }

  forgotPasswordWithEmail(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: this.redirectTo,
    });
  }
  resetPassword(password: string): Promise<UserResponse> {
    return this.supabase.auth.updateUser({ password });
  }

  updateMetaDonneeOfUser(content: Record<any, any>): Promise<UserResponse> {
    return this.supabase.auth.updateUser({ data: content });
  }

  getUser() {
    return this.supabase.auth.getUser();
  }
}
