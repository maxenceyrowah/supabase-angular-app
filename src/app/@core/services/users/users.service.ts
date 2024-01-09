import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment.development';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private router: Router,
    private supabaseInstance: SupabaseService
  ) {}

  getUsers() {
    return this.supabaseInstance.supabase.from('users').select('*');
  }

  async getUser() {
    const localStorage = this.supabaseInstance.getLocalStorage;

    return await this.supabaseInstance.supabase
      .from('users')
      .select('*')
      .eq('user_id', localStorage?.user?.id);
  }
}
