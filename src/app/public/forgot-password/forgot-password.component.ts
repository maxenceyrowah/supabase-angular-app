import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  forgotForm = this.fb.group({
    email: ['', Validators.required],
  });
  constructor(
    private supabase: SupabaseService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  async sendLinkToForgotPasswordByEmail() {
    const dataForm = this.forgotForm.value;
    const { email } = dataForm;

    try {
      const { data, error } = await this.supabase.forgotPasswordWithEmail(
        email as string
      );

      this.router.navigate(['./public/login']);
      alert('Veuillez vérifie votre boite e-mail.');
    } catch (error) {
      console.log(
        '🚀 ~ file: forgot-password.component.ts:34 ~ ForgotPasswordComponent ~ sendLinkToForgotPasswordByEmail ~ error:',
        error
      );
    }
  }
}
