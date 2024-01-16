import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private supabaseInstance: SupabaseService) {}

  async getQuestions() {
    return await this.supabaseInstance.supabase
      .from('questions')
      .select('*')
      .order('question', { ascending: false });
  }

  async getSchemaOfQuestion() {
    return await this.supabaseInstance.supabase
      .from('questions')
      .select('schema');
  }

  async getQuestion(questionId: string) {
    return await this.supabaseInstance.supabase
      .from('questions')
      .select('*')
      .eq('id', questionId);
  }

  async postQuestion(question: Record<any, any>) {
    return await this.supabaseInstance.supabase
      .from('questions')
      .insert(question);
  }

  async putQuestion(question: Record<any, any>, question_id: string) {
    return await this.supabaseInstance.supabase
      .from('questions')
      .update(question)
      .eq('id', question_id);
  }

  async putSpecificQuestionBycolum(
    question: Record<any, any>,
    question_id: string
  ) {
    return await this.supabaseInstance.supabase
      .from('questions')
      .update(question)
      .eq('id', question_id)
      .select('*');
  }
}
