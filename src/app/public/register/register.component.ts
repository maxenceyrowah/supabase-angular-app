import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';
import { Iregister } from 'src/app/@core/models/register';

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

  register() {
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

    this.supbaseService.register(dataForm);
    this.router.navigate(['/public/login']);
  }
}
