import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  PasswordPolicyStatus,
  checkPassword
} from '../../password-policy';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  form!: FormGroup;
  token = '';
  loading = false;
  message = '';

  passwordStatus: PasswordPolicyStatus = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    valid: false
  };

  private api =
    'http://localhost:8087/auth-service/auth/reset-password';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.message = 'Invalid or expired reset link';
      return;
    }

    this.form = this.fb.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });

    // 🔥 LIVE password validation
    this.form.get('newPassword')!.valueChanges.subscribe(value => {
      this.passwordStatus = checkPassword(value || '');
      this.cdr.detectChanges();
    });
  }

  passwordsMatch(): boolean {
    return (
      this.form.value.newPassword ===
      this.form.value.confirmNewPassword
    );
  }

  submit(): void {
    if (
      this.form.invalid ||
      !this.passwordStatus.valid ||
      !this.passwordsMatch()
    ) {
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.post(
      this.api,
      {
        token: this.token,
        newPassword: this.form.value.newPassword,
        confirmNewPassword: this.form.value.confirmNewPassword
      },
      { responseType: 'text' }
    ).subscribe({
      next: (res) => {
        this.message = res;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message =
          err?.error || 'Invalid or expired reset link';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}