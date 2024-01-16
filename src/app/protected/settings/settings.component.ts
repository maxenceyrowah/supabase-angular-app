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

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  questionForm: FormGroup;
  user: any;
  questions: any;
  TYPE_FIELD = ['text', 'email', 'number', 'textarea'];
  TYPE_SELECT = ['select', 'radio'];

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private questionService: QuestionsService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getQuestions();
    this.initializeForm();
  }

  initializeForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      question_type: ['', Validators.required],
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

    this.watchTypeChanges();
  }

  watchTypeChanges() {
    const schemasArray = this.questionForm.get('schemas') as FormArray;
    schemasArray
      .at(0)
      .get('type')
      ?.valueChanges.subscribe((type: string) => {
        const optionsArray = schemasArray.at(0).get('options') as FormArray;
        const validationsArray = schemasArray
          .at(0)
          .get('validations') as FormArray;

        while (optionsArray.length) {
          optionsArray.removeAt(0);
        }

        while (validationsArray.length) {
          validationsArray.removeAt(0);
        }

        if (type === 'select' || type === 'radio') {
          optionsArray.push(
            this.fb.group({
              label: ['', Validators.required],
              value: ['', Validators.required],
            })
          );
        }
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
}
