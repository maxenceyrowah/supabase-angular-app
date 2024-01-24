import { Injectable } from '@angular/core';

import { SupabaseService } from '../supabase/supabase.service';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  roles: string[] = [Role.ADMIN];
  constructor(private supabaseInstance: SupabaseService) {}

  getUsers() {
    return this.supabaseInstance.supabase.from('users').select('*');
  }

  async getUser(userId?: string) {
    const localStorage = this.supabaseInstance.getLocalStorage;
    const currentUser = userId || localStorage?.user?.id;

    return await this.supabaseInstance.supabase
      .from('users')
      .select('*')
      .eq('user_id', currentUser);
  }

  get isAdmin() {
    const userConnected = this.supabaseInstance.getLocalStorage;
    const roleOfUserConnected =
      userConnected?.['user']?.['user_metadata'].profile;
    return this.roles.includes(roleOfUserConnected);
  }
}
