import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  dbName = 'questions';
  constructor(private supabaseInstance: SupabaseService) {}

  async getQuestions() {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .select('*')
      .order('question', { ascending: false });
  }

  async getSchemaOfQuestion() {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .select('schema');
  }

  async getQuestion(questionId: string) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .select('*')
      .eq('id', questionId);
  }

  async getQuestionByCategoeyId(categoryId: string) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .select('*')
      .eq('category_id', categoryId);
  }

  async postQuestion(question: Record<any, any>) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .insert(question);
  }

  async putQuestion(question: Record<any, any>, question_id: string) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .update(question)
      .eq('id', question_id);
  }

  async putSpecificQuestionBycolum(
    question: Record<any, any>,
    question_id: string
  ) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .update(question)
      .eq('id', question_id)
      .select('*');
  }

  async deleteQuestion(questionId: string) {
    return await this.supabaseInstance.supabase
      .from(this.dbName)
      .delete()
      .eq('id', questionId);
  }
}
