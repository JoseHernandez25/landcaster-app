import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  public isLoading: boolean = false;

  public loginForm: FormGroup = this.formBuilder.group({
    email: [, [Validators.required]],
    password: [, [Validators.required, Validators.minLength(8)]],
  });

  get errorControl() {
    return this.loginForm.controls;
  }

  login() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      this.isLoading = false;
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (resp) => {
        this.isLoading = false;
        console.log(resp);
      },
      error: (message) => {
        this.isLoading = false;
        console.log(message);

      },
    });
  }

  validateInput(input: string) {
    return (
      this.loginForm.controls[input].errors && this.loginForm.controls[input].touched
    );
  }
}
