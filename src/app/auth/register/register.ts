import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { checkPassword,PasswordPolicyStatus } from '../../password-policy';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  message = '';
  registerForm: FormGroup;
  passwordStatus: PasswordPolicyStatus | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onPasswordInput() {
    const pwd = this.registerForm.value.password || '';
    this.passwordStatus = checkPassword(pwd);
  }

  register() {
    if (
      this.registerForm.invalid ||
      !this.passwordStatus ||
      !this.passwordStatus.valid
    ) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.auth.signup(this.registerForm.value).subscribe({
      next: () => {
        this.message = 'Registration successful. Please login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message =
          err?.error ||
          err?.error?.message ||
          'User already exists';
        this.cdr.detectChanges();
      }
    });
  }
}