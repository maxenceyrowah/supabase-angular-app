import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  resetForm = this.fb.group({
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async resetPassword() {
    try {
      const dataform = this.resetForm.value;
      const { password } = dataform;
      const { data, error } = await this.supabase.resetPassword(
        password as string
      );

      if (data.user) {
        this.router.navigate(['/public/login']);
        alert('Veuillez vous connecter');
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: reset-password.component.ts:33 ~ ResetPasswordComponent ~ resetPassword ~ error:',
        error
      );
    }
  }
}
