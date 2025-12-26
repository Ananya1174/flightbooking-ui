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
  message = '';
  loading = false;

  private api =
    'http://localhost:8087/auth-service/auth/reset-password';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.message = 'Invalid or expired reset link';
      return;
    }

    this.form = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/
          )
        ]
      ],
      confirmNewPassword: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword, confirmNewPassword } = this.form.value;

    if (newPassword !== confirmNewPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.post(
      this.api,
      {
        token: this.token,
        newPassword
      },
      {
        responseType: 'text' // ✅ VERY IMPORTANT
      }
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