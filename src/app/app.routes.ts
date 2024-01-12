import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { SupabaseService } from './@core/services/supabase/supabase.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { guestGuard } from './@core/guards/guest/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      {
        path: '',
        canMatch: [() => inject(SupabaseService).isLoggedIn],
        loadChildren: () =>
          import('./protected/protected.routes').then((m) => m.ProtectedRoutes),
      },
      {
        path: 'public',
        canActivate: [guestGuard],
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes),
      },
      {
        path: '**',
        component: ErrorPageComponent,
      },
    ],
  },
];
