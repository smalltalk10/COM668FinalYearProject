import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { WebService } from '../../web.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './authentication.modal.component.html',
  styleUrls: ['./../nav.component.css'],
})
export class AuthenticationModalComponent {
  constructor(
    public webService: WebService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  loginForm: any;
  registerForm: any;
  errorMessage: string = '';
  emailIsValid: boolean = false;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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
      password: ['', Validators.required],
      deviceID: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  loginIsInvalid(control: any) {
    return (
      this.loginForm.controls[control].invalid &&
      this.loginForm.controls[control].touched
    );
  }
  
  loginIsUntouched() {
    return (
      this.loginForm.controls.username.pristine ||
      this.loginForm.controls.password.pristine
    );
  }

  loginIsIncomplete() {
    return (
      this.loginIsInvalid('username') ||
      this.loginIsInvalid('password') ||
      this.loginIsUntouched()
    );
  }

  updateEmailValidity() {
    this.emailIsValid = this.registerForm.controls.email.valid;
  }

  registerIsInvalid(control: any) {
    return (
      this.registerForm.controls[control].invalid &&
      this.registerForm.controls[control].touched
    );
  }

  registerIsUntouched() {
    return (
      this.registerForm.controls.username.pristine ||
      this.registerForm.controls.deviceID.pristine ||
      this.registerForm.controls.email.pristine ||
      this.registerForm.controls.password.pristine
    );
  }

  registerIsIncomplete() {
    return (
      this.registerIsInvalid('username') ||
      this.registerIsInvalid('deviceID') ||
      this.registerIsInvalid('email') ||
      this.registerIsInvalid('password') ||
      this.registerIsUntouched() ||
      !this.emailIsValid
    );
  }

  onSubmitUserLogin() {
    this.webService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
          sessionStorage.setItem('token', response.token);
          this.closeModal();
          this.router.navigateByUrl('/dashboard');
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
          this.closeModal();
      },
      error: (error) => {
        console.error('HTTP error:', error);
        const decodedMessage = error?.error?.message || 'Unknown error';
        this.errorMessage = 'Registration failed: ' + decodedMessage ;
      },
    });
  }
}
