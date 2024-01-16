import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const supabase = inject(SupabaseService);

  if (supabase.isLoggedIn) {
    router.navigate(['/dashboard/home']);
    return false;
  }

  return true;
};
