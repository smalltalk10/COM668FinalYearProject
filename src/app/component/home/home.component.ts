import { Component, ViewChild } from '@angular/core';
import { WebService } from '../../web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: '',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    public webService: WebService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  loginForm: any;
  registerForm: any;
  errorMessage: string = '';
  loginPasswordIsValid: boolean = false;
  registerEmailIsValid: boolean = false;
  registerPasswordIsValid: boolean = false;
  decodedToken: any;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-]+$')
        ],
      ],
    });
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-]+$')
        ],
      ],
      deviceID: ['', Validators.required]
    });
  }

  updateLoginPasswordValidity() {
    this.loginPasswordIsValid = this.loginForm.controls.password.valid;
  }

  updateRegisterEmailValidity() {
    this.registerEmailIsValid = this.registerForm.controls.email.valid;
  }

  updateRegisterPasswordValidity() {
    this.registerPasswordIsValid = this.registerForm.controls.password.valid;
  }

  isInvalid(controlName: string, formName: 'loginForm' | 'registerForm'): boolean {
    const control = this[formName].get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
  
  isIncomplete(formName: 'loginForm' | 'registerForm'): boolean {
    const form = formName === 'loginForm' ? this.loginForm : this.registerForm;
    return form.invalid || form.pristine;
  }

  onSubmitUserLogin() {
    this.webService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('token', response.token);
        this.router.navigateByUrl('/dashboard');
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('HTTP error:', error);
        const decodedMessage = error?.error?.message || 'Unknown error';
        this.errorMessage = 'Login failed: ' + decodedMessage;
      },
    });
  }

  onSubmitUserRegister() {
    this.webService.createUser(this.registerForm.value).subscribe({
      next: () => {
        this.errorMessage = '';
        this.tabGroup.selectedIndex = 0;
      },
      error: (error) => {
        console.error('HTTP error:', error);
        const decodedMessage = error?.error?.message || 'Unknown error';
        this.errorMessage = 'Registration failed: ' + decodedMessage;
      },
    });
  }
}