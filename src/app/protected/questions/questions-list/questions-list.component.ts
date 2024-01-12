import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionsService } from 'src/app/@core/services/questions/questions.service';

enum StatusQuestion {
  'in_progress' = 'En cours',
  'done' = 'Valider',
}

const STATUS: { [k: string]: string } = {
  in_progress: 'En cours',
  done: 'Complete',
};
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

  getStatutOfQuestions(status: StatusQuestion) {
    return STATUS[`${status}`];
  }
}
