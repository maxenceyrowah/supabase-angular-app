import { Routes } from '@angular/router';
import { authGuard } from './@core/guards/auth/auth.guard';
import { guestGuard } from './@core/guards/guest/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      {
        path: '',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./protected/protected.routes').then((m) => m.ProtectedRoutes),
      },
      {
        path: 'public',
        canActivate: [guestGuard],
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes),
      },
    ],
  },
];
