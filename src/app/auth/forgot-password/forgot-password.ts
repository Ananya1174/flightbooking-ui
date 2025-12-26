import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  form: FormGroup;
  message = '';
  loading = false;

  private api =
    'http://localhost:8087/auth-service/auth/forgot-password';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.post(this.api, this.form.value).subscribe({
      next: () => {
        this.message =
          'If the email exists, a password reset link has been sent.';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message =
          ' A password reset link has been sent.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}