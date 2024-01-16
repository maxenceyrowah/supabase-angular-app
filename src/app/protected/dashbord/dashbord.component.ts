import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';
import { IfAuthDirective } from 'src/app/@core/directives/if-auth.directive';
import { IfAdminDirective } from 'src/app/@core/directives/if-admin.directive';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    IfAuthDirective,
    IfAdminDirective,
  ],
  templateUrl: './dashbord.component.html',
})
export class DashbordComponent {
  constructor(private supabase: SupabaseService, private router: Router) {}

  logout() {
    this.supabase.logout();
    localStorage.clear();
    this.router.navigate(['/public/login']);
  }
}
