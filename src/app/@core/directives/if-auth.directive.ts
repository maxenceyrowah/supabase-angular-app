import { NgIf } from '@angular/common';
import { Directive, OnInit, inject } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { UsersService } from '../services/users/users.service';

@Directive({
  selector: '[appIfAuth]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgIf,
    },
  ],
})
export class IfAuthDirective implements OnInit {
  private isAuth = inject(SupabaseService).isLoggedIn;
  private ngIfDirective = inject(NgIf);
  private isAdmin = inject(UsersService).isAdmin === false;

  ngOnInit() {
    this.ngIfDirective.ngIf = this.isAuth && this.isAdmin;
  }
}
