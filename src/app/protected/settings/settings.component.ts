import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { QuestionsService } from 'src/app/@core/services/questions/questions.service';
import { UsersService } from 'src/app/@core/services/users/users.service';
import { CategoriesService } from 'src/app/@core/services/categories/categories.service';
import { Category } from 'src/app/@core/models/categories';
import { QuestionListViewComponent } from './components/question-list-view.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuestionListViewComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  questionForm: FormGroup;
  user: any;
  questions: any;
  TYPE_FIELD = ['text', 'email', 'number', 'textarea'];
  TYPE_SELECT = ['select', 'radio'];
  categories: Category[];

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private questionService: QuestionsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getCategories();
    this.getQuestions();
    this.initializeForm();
  }

  initializeForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      category_id: ['', Validators.required],
      schemas: this.fb.array([
        this.fb.group({
          type: ['', Validators.required],
          field_name: ['', Validators.required],
          value: [null],
          options: this.fb.array([]),
          validations: this.fb.array([]),
        }),
      ]),
    });

    this.setDefaultOptionWhenSelectTypeChanges();
  }

  setDefaultOptionWhenSelectTypeChanges() {
    const schemasArray = this.questionForm.get('schemas') as FormArray;

    if (!schemasArray) {
      return;
    }
    schemasArray.valueChanges.subscribe((schemas) => {
      schemas.forEach((schema: any, sIndex: any) => {
        if (schemasArray.at(sIndex)) {
          const optionsArray = schemasArray
            .at(sIndex)
            .get('options') as FormArray;

          if (schema.type === 'select' || schema.type === 'radio') {
            if (optionsArray && optionsArray.length === 0) {
              const newOption = this.fb.group({
                label: ['', Validators.required],
                value: ['', Validators.required],
              });
              optionsArray.push(newOption);
            }
          } else {
            optionsArray.clear();
          }
        }
      });

      this.questionForm
        .get('schemas')
        ?.patchValue(schemas, { emitEvent: false });
    });
  }
  getUser() {
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
  getCategories() {
    this.categoriesService
      .getCategories()
      .then((categories) => (this.categories = categories?.data as Category[]))
      .catch((error) => {
        console.log('[] error', error);
      });
  }
  registerQuestion() {
    this.questionForm.markAllAsTouched();
    if (!this.questionForm.valid) return;

    const entryData = this.questionForm.value;

    const dataForm = {
      ...entryData,
      status: 'unanswered',
      user_id: this.user?.id,
    };

    this.questionService
      .postQuestion(dataForm)
      .then((result) => {
        this.getQuestions();
        this.initializeForm();
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }

  // schemas logic
  get schemas() {
    return this.questionForm.get('schemas') as FormArray;
  }
  addSchema() {
    this.schemas.push(
      this.fb.group({
        type: ['', Validators.required],
        field_name: ['', Validators.required],
        value: null,
        options: this.fb.array([]),
        validations: this.fb.array([]),
      })
    );
  }
  removeSchema(schemaIndex: number) {
    this.schemas.removeAt(schemaIndex);
  }

  // options login when option is select
  getOptons(schemaIndex: number) {
    return this.questionForm.get(`schemas.${schemaIndex}.options`) as FormArray;
  }
  addOption(schemaIndex: number) {
    this.getOptons(schemaIndex).push(
      this.fb.group({
        label: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }
  removeOption(schemaIndex: number, optionIndex: number) {
    this.getOptons(schemaIndex).removeAt(optionIndex);
  }

  // validation loginc
  getValidations(schemaIndex: number) {
    return this.questionForm.get(
      `schemas.${schemaIndex}.validations`
    ) as FormArray;
  }
  addValidation(schemaIndex: number) {
    this.getValidations(schemaIndex).push(
      this.fb.group({
        message: [null],
        required: ['', Validators.required],
      })
    );
  }
  removeValidation(schemaIndex: number, validationIndex: number) {
    this.getValidations(schemaIndex).removeAt(validationIndex);
  }

  deleteQuestion(question: any) {
    this.questionService
      .deleteQuestion(question.id)
      .then(() => {
        this.getQuestions();
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }
}
