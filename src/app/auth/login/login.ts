import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  message = '';
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.message = '';
    this.loading = true;

    const payload = this.loginForm.value;

    this.auth.signin(payload).subscribe({
      next: (res) => {
        console.log('LOGIN RESPONSE', res);

        // ✅ Save token + flags
        this.auth.saveToken(res.token);

        // 🔐 PASSWORD EXPIRED FLOW
        if (res.passwordExpired === true) {
          this.message =
            '⚠️ Your password has expired. Please change it to continue.';

          this.router.navigate(['/profile'], {
            queryParams: { forcePasswordChange: true }
          });
        } else {
          this.router.navigate(['/']);
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.message =
          typeof err?.error === 'string'
            ? err.error
            : 'Invalid email or password';

        this.cdr.detectChanges();
      }
    });
  }
}