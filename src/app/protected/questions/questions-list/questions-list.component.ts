import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionsService } from 'src/app/@core/services/questions/questions.service';
import { STATUS } from 'src/app/@core/models/status';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './questions-list.component.html',
})
export class QuestionsListComponent implements OnInit {
  questions: any;

  constructor(private questionService: QuestionsService) {}

  ngOnInit() {
    this.getQuestions();
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

  translateStatus(status: string) {
    return STATUS[`${status}`];
  }
}
