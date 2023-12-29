import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/@core/services/supabase/supabase.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profiles.component.html',
})
export class ProfilesComponent implements OnInit {
  private user: any;
  profilForm!: FormGroup;
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private fb: FormBuilder,
    private supbaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUser();
    this.initProfilForm();
  }

  getUser() {
    this.supabase.getUser().then((response) => {
      const currentUser = response?.data?.user;
      const dataForm = {
        ...currentUser?.user_metadata,
        email: response?.data?.user?.email,
      };
      this.profilForm.patchValue(dataForm);
    });
  }

  updateUser() {
    const dataForm = this.profilForm.value;
    const { email, ...rest } = dataForm;
    this.loading = true;
    this.supabase
      .updateMetaDonneeOfUser(rest)
      .then(() => {
        this.getUser();
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
      });
  }

  initProfilForm() {
    this.profilForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      gender: [''],
      birthday: [''],
      city: [''],
      municipality: [''],
      email: new FormControl({ value: null, disabled: true }),
    });
  }
}
