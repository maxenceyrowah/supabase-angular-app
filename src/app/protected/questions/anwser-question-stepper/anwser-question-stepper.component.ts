import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { CategoriesService } from 'src/app/@core/services/categories/categories.service';
import { IFormStructure } from 'src/app/@core/models/structure-form';
import { QuestionsService } from 'src/app/@core/services/questions/questions.service';

@Component({
  selector: 'app-anwser-question-stepper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
  ],
  templateUrl: './anwser-question-stepper.html',
})
export class AnwserQuestionStepperComponent implements OnInit {
  dynamicForm: FormGroup = this.fb.group({});
  formStructure: IFormStructure[] = [];

  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private questionService: QuestionsService
  ) {}

  ngOnInit() {
    this.getCategoriesByQuestions();
  }

  getCategoriesByQuestions() {
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
          schemas: question.schemas,
        });
      });

      this.categories = Object.values(groupedQuestionsByCategory);
      this.buildQuestionFormByAnswer();
    });
  }
  buildQuestionFormByAnswer() {
    this.questionService
      .getQuestions()
      .then((questions) => {
        let formGroup: Record<string, any> = {};

        this.formStructure = this.buildSchemaFied(questions);
        this.buildFormGroup(this.formStructure, formGroup);
        this.dynamicForm = this.fb.group(formGroup);
      })
      .catch((error) => {
        console.log('[getSchemaOfQuestion] error', error);
      });
  }
  buildFormGroup(
    structureForm: IFormStructure[],
    formGroup: Record<string, any>
  ) {
    return structureForm.forEach((control) => {
      let controlValidators: Validators[] = [];

      if (control?.validations) {
        control.validations.forEach(
          (validation: { required: string; message: string }) => {
            if (this.requiredField(validation.required))
              controlValidators.push(Validators.required);
            if (control.type === 'email')
              controlValidators.push(Validators.email);
          }
        );
      }

      formGroup[control.field_name] = [control.value || '', controlValidators];
    });
  }
  buildSchemaFied(fields: any) {
    return (fields?.data || []).map(
      (field: {
        schemas: Record<any, any>;
        answer: Record<any, any>;
        question: string;
      }) => {
        const schemaField = field?.schemas?.[0];
        schemaField['label'] = field?.question;
        return schemaField;
      }
    );
  }
  requiredField(validation: string | undefined) {
    return Boolean(validation);
  }

  handleSubmit() {
    const dataForm = this.dynamicForm.value;
    console.log(
      '🚀 ~ AnwserQuestionStepperComponent ~ handleSubmit ~ dataForm:',
      dataForm
    );
  }
}
