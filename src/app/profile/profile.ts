import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../services/auth';
import { checkPassword, PasswordPolicyStatus } from '../password-policy';
import { ChangeDetectorRef } from '@angular/core';

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

  // 🔐 FORCE FLAG
  forcePasswordChange = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.email = this.auth.getUserEmail();

    // 🔐 CHECK FORCE PASSWORD CHANGE
    this.route.queryParams.subscribe(params => {
      if (
        params['forcePasswordChange'] === 'true' ||
        this.auth.isPasswordChangeRequired()
      ) {
        this.forcePasswordChange = true;
        this.activeSection = 'password';
      }
    });
  }

  // 🔐 CONFIRM PASSWORD VALIDATOR
  passwordMatchValidator(form: AbstractControl) {
    const newPwd = form.get('newPassword')?.value;
    const confirmPwd = form.get('confirmPassword')?.value;

    if (!newPwd || !confirmPwd) return null;
    return newPwd === confirmPwd ? null : { passwordMismatch: true };
  }

  // 🔐 LIVE PASSWORD CHECK
  onNewPasswordInput() {
    const newPwd = this.passwordForm.value.newPassword || '';
    const oldPwd = this.passwordForm.value.oldPassword || '';

    this.passwordStatus = checkPassword(newPwd);
    this.sameAsOld = newPwd && oldPwd && newPwd === oldPwd;
  }

  // 🔐 BLOCK PROFILE CLICK
  switchSection(section: 'profile' | 'password') {
    if (this.forcePasswordChange && section === 'profile') {
      return; // ❌ blocked
    }
    this.activeSection = section;
  }

  // 🔐 CHANGE PASSWORD
  changePassword() {
    this.successMessage = '';
    this.errorMessage = '';

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

    const token = localStorage.getItem('token');

    this.loading = true;
    this.cdr.detectChanges();

    this.http
      .put(
        'http://localhost:8087/auth-service/auth/change-password',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'text',
        }
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (msg) => {
          this.successMessage = msg;
          this.passwordForm.reset();
          this.passwordStatus = null;

          // 🔐 CLEAR FORCE FLAG
          localStorage.removeItem('passwordChangeRequired');

          this.cdr.detectChanges();

          setTimeout(() => this.auth.signout(), 1500);
        },
        error: (err) => {
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'Session expired. Please login again.';
          } else {
            this.errorMessage = 'Password update failed';
          }

          this.cdr.detectChanges();
        },
      });
  }
}