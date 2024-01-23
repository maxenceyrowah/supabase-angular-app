import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-list-view',
  standalone: true,
  template: `
    <div
      class="relative min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
    >
      <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
          <h6 class="text-blueGray-700 text-xl font-bold">
            Liste des questions
          </h6>
        </div>
      </div>

      <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <table class="border-collapse w-full">
          <thead>
            <tr>
              <th
                align="left"
                class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                Question
              </th>

              <th
                align="left"
                class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                Schemas
              </th>

              <th
                align="center"
                class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              class="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              *ngFor="let question of questions"
            >
              <td
                align="left"
                class="w-full lg:w-auto p-3 text-gray-800 border border-b block lg:table-cell relative lg:static"
              >
                {{ question.question }}
              </td>

              <td
                align="left"
                class="w-full lg:w-auto p-3 text-gray-800 border border-b block lg:table-cell relative lg:static"
              >
                {{ question.schemas | json }}
              </td>

              <td
                align="center"
                class="w-full lg:w-auto p-3 text-gray-800 border border-b block lg:table-cell relative lg:static"
              >
                <div>
                  <button
                    (click)="delete.emit({ id: question.id })"
                    class="bg-indigo-50 text-indigo-600 rounded-md p-2 mr-2 mb-2"
                  >
                    Supprimer
                  </button>
                  <button
                    class="bg-indigo-50 text-indigo-600 rounded-md p-2 mr-2"
                  >
                    Modifier
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  imports: [CommonModule],
})
export class QuestionListViewComponent {
  @Input({ required: true }) questions: any;

  @Output() delete = new EventEmitter<any>();
}
