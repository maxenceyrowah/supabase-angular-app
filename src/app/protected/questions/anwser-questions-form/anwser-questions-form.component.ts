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

@Component({
  selector: 'app-anwser-questions-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
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
    this.getCurrentUser();
  }

  getSchemaOfQuestion() {
    this.questionService.getQuestion(this.questionId).then((questions) => {
      this.question = questions;
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

  async save() {
    if (!this.dynamicForm.valid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    const dataForm = {
      answer: this.dynamicForm.value,
      question_id: this.questionId,
      user_id: this.user.id,
    };

    this.handleAnswerCreationProcess(dataForm);
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
          this.createAnwsers(content);
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
        libelle: 'Idee-001',
        user_id: this.user.id,
      })
      .then((res) => {
        this.folderId = res?.data?.[0].folder_id;
        this.createAnwsers(content);
      })
      .catch((error) => {});
  }
  createAnwsers(content: any) {
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
}
