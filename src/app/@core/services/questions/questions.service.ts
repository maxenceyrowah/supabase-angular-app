import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(
    private router: Router,
    private supabaseInstance: SupabaseService
  ) {}

  async getQuestions() {
    return await this.supabaseInstance.supabase.from('questions').select('*');
  }

  async getSchemaOfQuestion() {
    return await this.supabaseInstance.supabase
      .from('questions')
      .select('schema');
  }
}
