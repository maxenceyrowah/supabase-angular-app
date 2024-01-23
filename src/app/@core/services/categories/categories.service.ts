import { Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

import { SupabaseService } from '../supabase/supabase.service';
import { Category } from '../../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  dbName = 'categories';
  constructor(private supabaseInstance: SupabaseService) {}

  async getCategories(): Promise<PostgrestSingleResponse<Category[]>> {
    return await this.supabaseInstance.supabase.from(this.dbName).select('*');
  }

  async getCategory(
    categoryId: string
  ): Promise<PostgrestSingleResponse<Category[]>> {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .select('*')
      .eq('id', categoryId);
  }

  async getQuestionsByCategories() {
    return await this.supabaseInstance.supabase
      .from('questions')
      .select(
        `id, question, status, category_id, categories!inner (id, label, value)`
      );
  }
}
