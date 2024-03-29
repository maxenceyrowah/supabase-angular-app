import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { QuestionsService } from 'src/app/@core/services/questions/questions.service';
import { IFormStructure } from 'src/app/@core/models/structure-form';
import { AnwserService } from 'src/app/@core/services/anwser/anwser.service';
import { UsersService } from 'src/app/@core/services/users/users.service';
import { FoldersService } from 'src/app/@core/services/folders/folders.service';
import { CategoriesService } from 'src/app/@core/services/categories/categories.service';
import { AnwserQuestionStepperComponent } from '../anwser-question-stepper/anwser-question-stepper.component';

@Component({
  selector: 'app-anwser-questions-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AnwserQuestionStepperComponent,
  ],
  templateUrl: './anwser-questions-form.component.html',
})
export class AnwserQuestionsFormComponent implements OnInit {
  formStructure: IFormStructure[] = [];
  dynamicForm: FormGroup = this.fb.group({});
  user: any;
  question: any;
  folderId: string = '';
  @Input() questionId: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private questionService: QuestionsService,
    private anwserService: AnwserService,
    private folderService: FoldersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSchemaOfQuestion();
    this.getUser();
  }

  getSchemaOfQuestion() {
    this.anwserService
      .getQuestionHasAlreadyBeenAnswered(this.questionId)
      .then((answers) => {
        const answerValue = answers?.data?.[0];
        this.buildQuestionFormByAnswer(answerValue);
      })
      .catch((error) => {
        console.log('[getSchemaOfQuestion] error', error);
      });
  }
  buildQuestionFormByAnswer(answer: any) {
    this.questionService
      .getQuestion(this.questionId)
      .then((questions) => {
        this.question = questions;
        let formGroup: Record<string, any> = {};

        this.formStructure = this.buildSchemaFied(questions, answer);
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
  buildSchemaFied(fields: any, answerValue: any) {
    return (fields?.data || []).map(
      (field: {
        schemas: Record<any, any>;
        answer: Record<any, any>;
        question: string;
      }) => {
        const schemaField = field?.schemas?.[0];

        schemaField['label'] = field?.question;
        schemaField['value'] =
          answerValue?.answer?.[`${schemaField?.['field_name']}`] || '';

        return schemaField;
      }
    );
  }
  getErrorMessage(control: any) {
    const formControl = this.dynamicForm.get(control.field_name);

    if (!formControl) {
      return '';
    }

    for (let validation of control.validations) {
      if (this.requiredField(validation.required)) {
        return validation.message;
      }
    }

    return '';
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
  save() {
    this.dynamicForm.markAllAsTouched();

    if (!this.dynamicForm.valid) {
      return;
    }

    const dataForm = {
      answer: this.dynamicForm.value,
      question_id: this.questionId,
      user_id: this.user.id,
    };
    console.log(
      '🚀 ~ AnwserQuestionsFormComponent ~ save ~ dataForm:',
      dataForm
    );

    // this.handleAnswerCreationProcess(dataForm);
  }
  handleAnswerCreationProcess(content: any) {
    this.anwserService
      .getQuestionHasAlreadyBeenAnswered(this.questionId)
      .then((anwser) => {
        if (anwser?.data && anwser.data.length > 0) {
          const currentAnwser = anwser.data?.[0];
          this.updateAnwser(content, currentAnwser);
        } else {
          this.handleFolderCreationProcess(content);
        }
      });
  }
  handleFolderCreationProcess(content: any) {
    this.folderService
      .getfoldersByUserId(this.user?.id)
      .then((folder) => {
        if (folder.data && folder.data.length > 0) {
          this.folderId = folder?.data?.[0].folder_id;
          this.createAnwser(content);
        } else {
          this.createFolder(content);
        }
      })
      .catch((error) => {});
  }
  createFolder(content: any) {
    this.folderService
      .postFolder({
        status: 'in_progress',
        libelle: `Idee-${Math.random()}`,
        user_id: this.user.id,
      })
      .then((res) => {
        this.folderId = res?.data?.[0].folder_id;
        this.createAnwser(content);
      })
      .catch((error) => {});
  }
  createAnwser(content: any) {
    const dataform = content;
    dataform['folder_id'] = this.folderId;
    this.anwserService
      .postAnwser(content)
      .then((res) => {
        if (res?.data) {
          this.router.navigate(['/dashboard/questions']);
        }
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }
  updateAnwser(content: any, anwser: any) {
    const dataForm = content;
    dataForm['folder_id'] = anwser?.folder_id;

    this.anwserService
      .putAnwser(content, anwser?.id)
      .then((res) => {
        if (res?.data) {
          this.router.navigate(['/dashboard/questions']);
        }
      })
      .catch((error) => {});
  }
  requiredField(validation: string | undefined) {
    return Boolean(validation);
  }
}
