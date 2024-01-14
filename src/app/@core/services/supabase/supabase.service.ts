import { Injectable } from '@angular/core';

import {
  AuthError,
  AuthSession,
  SupabaseClient,
  User,
  UserResponse,
  createClient,
} from '@supabase/supabase-js';

import { environment } from 'src/environments/environment.development';
import { Iregister } from '../../models/register';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient;
  private redirectTo: string = 'http://localhost:4200/public/reset-password';
  private redirectToHome: string = 'http://localhost:4200/dashboard/home';
  _session: AuthSession | null = null;
  private hasTokenExistMsg =
    'Impossible de se connecter. Veuillez vérifier les informations saisies.';

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_ANON_KEY
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

  async register(credentials: Iregister) {
    const {
      data: { user: userContent },
      error,
    } = await this.supabase.auth.signUp(credentials);

    if (error) {
      console.error("Erreur d'inscription:", error.message);
      return;
    }

    await this.upsertUser(userContent);
  }

  getSessionEvent() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event && event === 'SIGNED_IN') {
        this.upsertUser(session?.user);
        this.router.navigate(['/dashboard/home']);
      }
    });
  }

  async upsertUser(user: User | null | undefined) {
    const { error } = await this.supabase.from('users').upsert({
      user_id: user?.id,
      email: user?.email,
      first_name: user?.user_metadata?.['first_name'],
      last_name: user?.user_metadata?.['last_name'],
      city: user?.user_metadata?.['city'],
      gender: user?.user_metadata?.['gender'],
      municipality: user?.user_metadata?.['municipality'],
      birthday: user?.user_metadata?.['birthday'],
      profile: 'USER',
    });

    if (error) {
      console.error(
        "Erreur lors de la création de l'utilisateur dans la table users:",
        error.message
      );
      return;
    }
  }

  logout(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }
  async login({ email, password }: { email: string; password: string }) {
    await this.supabase.auth.signInWithPassword({ email, password });

    const keys = Object.keys(localStorage);
    const value_1 = localStorage.getItem(keys?.[0]) as string;
    const supabaseAuthToken = JSON.parse(value_1);
    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', supabaseAuthToken?.user?.id);

    if (!supabaseAuthToken) {
      alert(this.hasTokenExistMsg);
      return;
    }
    supabaseAuthToken['user']['user_metadata']['profile'] = data?.[0].profile;
    localStorage.setItem(`${keys?.[0]}`, JSON.stringify(supabaseAuthToken));
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

  signInWithFacebook() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: this.redirectToHome,
      },
    });
  }
  async signInWithGoogle() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: this.redirectToHome,
      },
    });
  }

  get getLocalStorage() {
    const keys = Object.keys(localStorage);
    const localStorageContent = localStorage.getItem(keys?.[0]) as string;

    return JSON.parse(localStorageContent);
  }
}
