import { Component, OnInit } from '@angular/core';
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

    try {
      const { error } = await this.supbaseService.login(dataForm);
      if (error) {
        console.log(
          '🚀 ~ file: login.component.ts:46 ~ LoginComponent ~ login ~ error:',
          error
        );
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: login.component.ts:52 ~ LoginComponent ~ login ~ error:',
        error
      );
    }
  }

  async signInWithFacebook() {
    this.loading = true;
    const { data, error } = await this.supbaseService.signInWithFacebook();

    if (data) {
      console.log(
        '🚀 ~ file: login.component.ts:56 ~ LoginComponent ~ signInWithFacebook ~ data:',
        data
      );
      this.loading = false;
      // this.router.navigate(['/dashboard/home']);
    }
    if (error) {
      this.loading = false;
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    const { data, error } = await this.supbaseService.signInWithGoogle();

    if (data) {
      console.log(
        '🚀 ~ file: login.component.ts:56 ~ LoginComponent ~ signInWithFacebook ~ data:',
        data
      );
      this.loading = false;
      // this.router.navigate(['/dashboard/home']);
    }
    if (error) {
      this.loading = false;
    }
  }
}
