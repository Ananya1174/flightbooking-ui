import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
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

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.auth.signin(payload).subscribe({
      next: (res) => {
        console.log('LOGIN RESPONSE', res);
        this.auth.saveToken(res.token);
        this.message = 'Login successful';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('LOGIN ERROR', err);
        this.message = 'Invalid credentials';
        this.cdr.detectChanges();
      }
    });
  }
}