import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';
import { UsersService } from 'src/app/@core/services/users/users.service';
import { QuestionsService } from 'src/app/@core/services/questions/questions.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question.component.html',
})
export class QuestionComponent implements OnInit {
  questionForm = this.fb.group({
    schema: ['', [Validators.required]],
    question: ['', [Validators.required]],
  });
  user: any;
  questions: any;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private userService: UsersService,
    private questionService: QuestionsService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
    this.getQuestions();
  }

  getCurrentUser() {
    this.userService
      .getUser()
      .then((response) => {
        this.user = response?.data?.[0];
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }

  getQuestions() {
    this.questionService
      .getQuestions()
      .then((responses) => {
        this.questions = responses?.data;
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }

  registerQuestion() {
    const entryData = this.questionForm.value;

    const dataForm = {
      ...entryData,
      user_id: this.user?.user_id,
    };

    this.supabase
      .postQuestion(dataForm)
      .then((result) => {
        console.log(
          '🚀 ~ file: question.component.ts:68 ~ QuestionComponent ~ .then ~ result:',
          result
        );
        this.questionForm.reset();
        this.getQuestions();
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }
}
