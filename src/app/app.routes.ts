import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      {
        path: 'public',
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes),
      },
    ],
  },
];
