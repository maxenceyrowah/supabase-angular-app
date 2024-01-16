import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { QuestionsService } from 'src/app/@core/services/questions/questions.service';

interface IFormStructure {
  type: string;
  label: string;
  name: string;
  value: string | number | boolean;
  options?: { label: string; value: number | string | boolean }[];
  validations?: {
    name: string;
    validator: string;
    message: string;
  }[];
}

const formConfig: IFormStructure[] = [
  // {
  //   type: 'text',
  //   label: 'Nom',
  //   name: 'last_name',
  //   value: '',
  //   validations: [
  //     {
  //       name: 'required',
  //       validator: 'required',
  //       message: 'Name is required',
  //     },
  //   ],
  // },
  // {
  //   type: 'email',
  //   label: 'Adresse E-mail',
  //   name: 'email',
  //   value: '',
  //   validations: [
  //     {
  //       name: 'required',
  //       validator: 'email',
  //       message: 'E-mail is required',
  //     },
  //   ],
  // },
  // {
  //   type: 'text',
  //   label: 'Prénoms',
  //   name: 'first_name',
  //   value: '',
  //   validations: [],
  // },
  // {
  //   type: 'textarea',
  //   label: 'Description',
  //   name: 'description',
  //   value: '',
  //   validations: [
  //     {
  //       name: 'required',
  //       validator: 'required',
  //       message: 'Description is required',
  //     },
  //   ],
  // },
  // {
  //   type: 'number',
  //   label: 'Age',
  //   name: 'age',
  //   value: '',
  //   validations: [],
  // },
  // {
  //   type: 'radio',
  //   label: 'Gender',
  //   name: 'gender',
  //   value: false,
  //   options: [
  //     { label: 'Male', value: true },
  //     { label: 'Female', value: false },
  //   ],
  //   validations: [],
  // },
  {
    type: 'select',
    label: 'Country',
    name: 'country',
    value: 1,
    options: [
      { label: 'India', value: 1 },
      { label: 'USA', value: 2 },
      { label: 'Canada', value: 3 },
    ],
    validations: [
      {
        name: 'required',
        validator: 'required',
        message: 'Address is required',
      },
    ],
  },
];

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit {
  formStructure: IFormStructure[] = [];
  dynamicForm: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionsService
  ) {}

  ngOnInit() {
    this.getSchemaOfQuestion();
  }

  getSchemaOfQuestion() {
    this.questionService.getQuestions().then((questions) => {
      let formGroup: Record<string, any> = {};
      const currentJsonParseSchema = (questions?.data || []).map((response) => {
        const currentTransformSchema = JSON.parse(response?.schema);
        currentTransformSchema['label'] = response?.question;

        return currentTransformSchema;
      });

      this.formStructure = currentJsonParseSchema;
      this.formStructure.forEach((control) => {
        let controlValidators: Validators[] = [];

        if (control?.validations) {
          control.validations.forEach(
            (validation: {
              name: string;
              validator: string;
              message: string;
            }) => {
              if (validation.validator === 'required')
                controlValidators.push(Validators.required);
              if (validation.validator === 'email')
                controlValidators.push(Validators.email);
              // Add more built-in validators as needed
            }
          );
        }

        formGroup[control.name] = [control.value || '', controlValidators];
      });

      this.dynamicForm = this.fb.group(formGroup);
    });
  }

  getErrorMessage(control: any) {
    const formControl = this.dynamicForm.get(control.name);

    if (!formControl) {
      return '';
    }

    for (let validation of control.validations) {
      if (formControl.hasError(validation.name)) {
        return validation.message;
      }
    }

    return '';
  }

  onSubmit() {
    if (!this.dynamicForm.valid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }
    console.log(this.dynamicForm.value);
  }
}
