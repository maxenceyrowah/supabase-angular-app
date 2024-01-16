import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const supabase = inject(SupabaseService);

  if (!supabase.isLoggedIn) {
    router.navigate(['/public/login']);
    return false;
  }

  return true;
};
