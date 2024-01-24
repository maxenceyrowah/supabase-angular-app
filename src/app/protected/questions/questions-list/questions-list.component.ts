import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CategoriesService } from 'src/app/@core/services/categories/categories.service';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './questions-list.component.html',
})
export class QuestionsListComponent implements OnInit {
  questions: any;
  categories: any;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.getQuestionsByCategory();
  }

  getQuestionsByCategory() {
    this.categoriesService.getQuestionsByCategories().then((questions) => {
      const groupedQuestionsByCategory: Record<any, any> = {};

      (questions?.data || []).forEach((question: any) => {
        const categoryId = question.category_id;

        if (!groupedQuestionsByCategory[categoryId]) {
          groupedQuestionsByCategory[categoryId] = {
            category_id: categoryId,
            label: question.categories.label,
            value: question.categories.value,
            questions: [],
          };
        }
        groupedQuestionsByCategory[categoryId].questions.push({
          id: question.id,
          question: question.question,
          status: question.status,
        });
      });
      this.categories = Object.values(groupedQuestionsByCategory);
    });
  }

  trackById(index: number, obj: any): number {
    return obj.id;
  }
}
