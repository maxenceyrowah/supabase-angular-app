import { Routes } from '@angular/router';

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
        loadComponent: () =>
          import('./profiles/profiles.component').then(
            (m) => m.ProfilesComponent
          ),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./question/question.component').then(
            (m) => m.QuestionComponent
          ),
      },
      {
        path: 'quiz',
        loadComponent: () =>
          import('./quiz//quiz.component').then((m) => m.QuizComponent),
      },
    ],
  },
];
