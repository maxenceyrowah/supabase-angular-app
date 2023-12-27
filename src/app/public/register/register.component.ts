import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';
import { Iregister } from 'src/app/@core/models/register';
import { AuthError } from '@supabase/supabase-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    gender: [''],
    birthday: [''],
    city: [''],
    municipality: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supbaseService: SupabaseService,
    private router: Router
  ) {}

  async register() {
    const entryData = this.registerForm.value;
    const {
      first_name,
      last_name,
      gender,
      birthday,
      city,
      municipality,
      confirmPassword,
      ...rest
    } = entryData;

    const dataForm: Iregister = {
      email: rest.email as string,
      password: rest.password as string,
      options: {
        data: {
          first_name,
          last_name,
          gender,
          birthday,
          city,
          municipality,
        },
      },
    };

    this.loading = true;

    try {
      const { data, error } = await this.supbaseService.register(dataForm);

      if (data.user) {
        this.loading = false;
        this.router.navigate(['/public/login']);
        this.registerForm.reset();
      }

      if (error) {
        console.log(
          '🚀 ~ file: register.component.ts:80 ~ RegisterComponent ~ register ~ error:',
          error
        );
      }
    } catch (error) {
      this.loading = false;
      console.log(
        '🚀 ~ file: register.component.ts:67 ~ RegisterComponent ~ register ~ error:',
        error
      );
    }
  }
}
