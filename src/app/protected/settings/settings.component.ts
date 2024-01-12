import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { QuestionsService } from 'src/app/@core/services/questions/questions.service';
import { UsersService } from 'src/app/@core/services/users/users.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  questionForm = this.fb.group({
    schema: [null, [Validators.required]],
    question: ['', [Validators.required]],
  });
  user: any;
  questions: any;

  constructor(
    private fb: FormBuilder,
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
      user_id: this.user?.id,
    };

    this.questionService
      .postQuestion(dataForm)
      .then((result) => {
        this.questionForm.reset();
        this.getQuestions();
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }
}
