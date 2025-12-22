import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  activeSection: 'profile' | 'password' = 'profile';

  passwordForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  email: string | null = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.loadUserDetails();
  }

  /* ✅ Correct password match validator */
  passwordMatchValidator = (form: FormGroup) => {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;

    if (
      confirmPassword.errors &&
      !confirmPassword.errors['passwordMismatch']
    ) {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }

    return null;
  };

  loadUserDetails() {
    this.email = localStorage.getItem('email');

    if (!this.email) {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.sub || payload.email || '';
      }
    }
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      currentPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    };

    const token = localStorage.getItem('token');

    this.http
      .put(
        'http://localhost:8087/auth-service/auth/change-password',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'text', // 🔥 THIS IS THE FIX
        }
      )
      .pipe(
        finalize(() => {
          this.loading = false; // always reset
        })
      )
      .subscribe({
        next: (response: string) => {
          // ✅ NOW THIS WILL EXECUTE
          this.successMessage = response;
          this.passwordForm.reset();
        },
        error: (err) => {
          this.errorMessage =
            err?.error || 'Failed to update password.';
        },
      });
  }
}