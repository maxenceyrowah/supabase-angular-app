import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AnwserService {
  constructor(private supabaseInstance: SupabaseService) {}

  async postAnwser(awnser: Record<any, any>) {
    return await this.supabaseInstance.supabase
      .from('answers')
      .insert(awnser)
      .select('*');
  }

  async putAnwser(anwser: Record<any, any>, anwserId: string) {
    return await this.supabaseInstance.supabase
      .from('answers')
      .update(anwser)
      .eq('id', anwserId)
      .select('*');
  }

  async getQuestionHasAlreadyBeenAnswered(questionId: string) {
    return await this.supabaseInstance.supabase
      .from('answers')
      .select('*')
      .eq('question_id', questionId);
  }

  // async getCheckIfQuestionHaveOneQanwser() {
  //   return await this.supabaseInstance.supabase
  //     .from('answers')
  //     .select('question_id', )
  //     .eq('question_id', questionId);
  // }

  async getAnwsers() {
    return await this.supabaseInstance.supabase.from('answers').select('*');
  }
}
