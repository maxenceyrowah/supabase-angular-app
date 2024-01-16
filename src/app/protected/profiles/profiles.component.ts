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
import { UsersService } from 'src/app/@core/services/users/users.service';

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
    private router: Router,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.getUser();
    this.initProfilForm();
  }

  getUser() {
    this.userService
      .getUser()
      .then((response) => {
        const currentUser = response?.data?.[0];

        this.user = currentUser;
        this.profilForm.patchValue(currentUser);
      })
      .catch((error) => {
        console.log('[] error', error);
      });
  }

  updateUser() {
    const dataForm = this.profilForm.value;
    const { email, ...rest } = dataForm;
    this.loading = true;
    this.supabase
      .updateMetaDonneeOfUser(rest)
      .then(() => {
        // this.getUser();
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
