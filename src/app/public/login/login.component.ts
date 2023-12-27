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
    private supbaseService: SupabaseService
  ) {}

  async login() {
    const entryData = this.loginForm.value;

    const dataForm = {
      email: entryData?.email as string,
      password: entryData?.password as string,
    };

    try {
      const { data, error } = await this.supbaseService.login(dataForm);

      if (data.user) {
        console.log(
          '🚀 ~ file: login.component.ts:37 ~ LoginComponent ~ login ~ data:',
          data
        );
      }

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
}
