import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UsersService } from '../@core/services/users/users.service';

export const ProtectedRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashbord/dashbord.component').then((m) => m.DashbordComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'profiles',
        canMatch: [() => !inject(UsersService).isAdmin],
        loadComponent: () =>
          import('./profiles/profiles.component').then(
            (m) => m.ProfilesComponent
          ),
      },
      {
        path: 'settings',
        canMatch: [() => inject(UsersService).isAdmin],
        loadComponent: () =>
          import('./settings//settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'questions',
        canMatch: [() => !inject(UsersService).isAdmin],
        loadComponent: () =>
          import('./questions/questions-list/questions-list.component').then(
            (m) => m.QuestionsListComponent
          ),
      },
      {
        path: 'questions/:questionId/anwser',
        canMatch: [() => !inject(UsersService).isAdmin],
        loadComponent: () =>
          import(
            './questions/anwser-questions-form/anwser-questions-form.component'
          ).then((m) => m.AnwserQuestionsFormComponent),
      },
    ],
  },
];
