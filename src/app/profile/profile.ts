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
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { checkPassword,PasswordPolicyStatus } from '../password-policy';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
activeSection: 'profile' | 'password' = 'profile';
email: string | null = null;
  passwordForm: FormGroup;
  passwordStatus: PasswordPolicyStatus | null = null;
  sameAsOld = false;

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.loadUserEmail();
  }
  private loadUserEmail() {
    this.email = this.auth.getUserEmail();
  }

  onNewPasswordInput() {
    const newPwd = this.passwordForm.value.newPassword || '';
    this.passwordStatus = checkPassword(newPwd);
    this.sameAsOld = newPwd === this.passwordForm.value.oldPassword;
  }

  changePassword() {
    if (
      this.passwordForm.invalid ||
      !this.passwordStatus?.valid ||
      this.sameAsOld
    ) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const payload = {
      currentPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    };

    this.loading = true;

    this.http
      .put(
        'http://localhost:8087/auth-service/auth/change-password',
        payload,
        { responseType: 'text' }
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage =
            'Password changed successfully. Please login again.';
          setTimeout(() => {
            this.auth.signout();
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err?.error || 'Password update failed';
        },
      });
  }
}