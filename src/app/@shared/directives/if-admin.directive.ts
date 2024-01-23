import { NgIf } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { SupabaseService } from '../../@core/services/supabase/supabase.service';
import { UsersService } from '../../@core/services/users/users.service';

@Directive({
  selector: '[appIfAdmin]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgIf,
    },
  ],
})
export class IfAdminDirective {
  private isAuth = inject(SupabaseService).isLoggedIn;
  private ngIfDirective = inject(NgIf);
  private isAdmin = inject(UsersService).isAdmin;

  ngOnInit() {
    this.ngIfDirective.ngIf = this.isAuth && this.isAdmin;
  }
}
