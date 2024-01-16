import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supbaseService: SupabaseService,
    private router: Router
  ) {}

  async login() {
    const entryData = this.loginForm.value;

    const dataForm = {
      email: entryData?.email as string,
      password: entryData?.password as string,
    };
    await this.supbaseService.login(dataForm);
  }

  async signInWithFacebook() {
    const { error } = await this.supbaseService.signInWithFacebook();
    this.supbaseService.getSessionEvent();
    this.router.navigate(['/dashboard/home']);

    if (error) {
      console.log('[signInWithFacebook] error', error);
    }
  }
  async signInWithGoogle() {
    const { error } = await this.supbaseService.signInWithGoogle();
    this.supbaseService.getSessionEvent();
    this.router.navigate(['/dashboard/home']);

    if (error) {
      console.log('[signInWithGoogle] error', error);
    }
  }
}
