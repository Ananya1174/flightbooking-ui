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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  message = '';
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {
    // ✅ Safe form initialization
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.auth.signup({
      ...this.registerForm.value,
    }).subscribe({
      next: () => {
        this.message = 'Registration successful';

        // ✅ Async update → trigger change detection
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Registration failed';

        // ✅ Async error update → trigger change detection
        this.cdr.detectChanges();
      }
    });
  }
}