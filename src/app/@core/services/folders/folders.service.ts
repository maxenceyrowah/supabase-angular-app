import { Injectable } from '@angular/core';

import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class FoldersService {
  private bd_folder_name: string = 'folders';
  constructor(private supabaseInstance: SupabaseService) {}

  async getfolders() {
    return await this.supabaseInstance.supabase
      .from(this.bd_folder_name)
      .select('*')
      .order('folder_id', { ascending: false });
  }

  async getfoldersByUserId(userId: string) {
    return await this.supabaseInstance.supabase
      .from(this.bd_folder_name)
      .select('*')
      .eq('user_id', userId);
  }

  async postFolder(folders: Record<any, any>) {
    return await this.supabaseInstance.supabase
      .from(this.bd_folder_name)
      .insert(folders)
      .select('*');
  }

  async putfolder(question: Record<any, any>, folderId: string) {
    return await this.supabaseInstance.supabase
      .from(this.bd_folder_name)
      .update(question)
      .eq('folder_id', folderId)
      .select('*');
  }
}
