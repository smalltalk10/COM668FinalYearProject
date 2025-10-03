import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from 'src/app/component/home/home.component';
import { WebService } from 'src/app/web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let webServiceMock: Partial<WebService>;
  let formBuilder: FormBuilder;
  let routerMock: Partial<Router>;

 beforeEach(async () => {
  webServiceMock = {
    login: jest.fn(),
    createUser: jest.fn(),
  };

  routerMock = {
    navigateByUrl: jest.fn(),
  };

  await TestBed.configureTestingModule({
    declarations: [HomeComponent],
    providers: [
      { provide: WebService, useValue: webServiceMock },
      FormBuilder,
      { provide: Router, useValue: routerMock },
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(HomeComponent);
  component = fixture.componentInstance;
  formBuilder = TestBed.inject(FormBuilder);

  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise login and register forms', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
    expect(component.loginForm.controls.username).toBeDefined();
    expect(component.loginForm.controls.password).toBeDefined();
    expect(component.registerForm.controls.username).toBeDefined();
    expect(component.registerForm.controls.email).toBeDefined();
    expect(component.registerForm.controls.password).toBeDefined();
    expect(component.registerForm.controls.deviceID).toBeDefined();
  });

  it('should check if login form controls are invalid', () => {
    component.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  
    component.loginForm.controls['username'].markAsTouched();
    component.loginForm.controls['password'].markAsTouched();
    expect(component.isInvalid('username', 'loginForm')).toBe(true);
    expect(component.isInvalid('password', 'loginForm')).toBe(true);
  });

  it('should check if login form is incomplete', () => {
    component.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    component.loginForm.controls['username'].markAsTouched();
    expect(component.isIncomplete('loginForm')).toBe(true);
  });

  it('should update register form email and password validity', () => {
    component.registerForm = formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      deviceID: ['', Validators.required],
    });

    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('testpassword1!');
    component.updateRegisterEmailValidity();
    component.updateRegisterPasswordValidity();
    expect(component.registerEmailIsValid).toBe(true);
    expect(component.registerPasswordIsValid).toBe(true);
  });

  it('should check if register form controls are invalid', () => {
    component.registerForm = formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      deviceID: ['', Validators.required],
    });

    component.registerForm.controls['email'].markAsTouched();
    expect(component.isInvalid('email', 'registerForm')).toBe(true);
  });


  it('should check if register form is incomplete', () => {
    component.registerForm = formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      deviceID: ['', Validators.required],
    });

    component.registerForm.controls['username'].markAsTouched();
    expect(component.isIncomplete('registerForm')).toBe(true);
  });

  it('should submit user login', () => {
    const loginFormValue = {
      username: 'testUser',
      password: 'testPassword',
    };
  
    const response = { token: 'test_token' };
    jest.spyOn(webServiceMock, 'login').mockReturnValue(of(response));
    const navigateByUrlSpy = jest.spyOn(routerMock as Router, 'navigateByUrl');
  
    component.loginForm = formBuilder.group(loginFormValue);
    component.onSubmitUserLogin();
  
    expect(webServiceMock.login).toHaveBeenCalledWith(loginFormValue);
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/dashboard');
    expect(component.errorMessage).toBe('');
  });
  

  it('should handle user login error', () => {
    const loginFormValue = {
      username: 'testUser',
      password: 'testPassword',
    };
    const error = { error: { message: 'Login error' } };
    jest.spyOn(webServiceMock, 'login').mockReturnValue(throwError(error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    component.loginForm = formBuilder.group(loginFormValue);
    component.onSubmitUserLogin();

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error:', error);
    expect(component.errorMessage).toBe('Login failed: Login error');
  });

  it('should update login form password validity', () => {
    component.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    component.loginForm.controls['password'].setValue('testpassword1!');

    component.updateLoginPasswordValidity();

    expect(component.loginPasswordIsValid).toBe(true);
  });

  it('should submit user registration', () => {
    const registerFormValue = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword',
      deviceID: 'device123',
    };
  
    const response = {};
    jest.spyOn(webServiceMock, 'createUser').mockReturnValue(of(response));
  
    component.registerForm = formBuilder.group(registerFormValue);
    component.registerEmailIsValid = true;
    component.onSubmitUserRegister();
  
    expect(webServiceMock.createUser).toHaveBeenCalledWith(registerFormValue);
    expect(component.errorMessage).toBe('');
  });

  it('should handle user registration error', () => {
    const registerFormValue = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword',
      deviceID: 'device123',
    };
    const error = { error: { message: 'Registration error' } };
    jest.spyOn(webServiceMock, 'createUser').mockReturnValue(throwError(error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    component.registerForm = formBuilder.group(registerFormValue);
    component.onSubmitUserRegister();

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error:', error);
    expect(component.errorMessage).toBe('Registration failed: Registration error');
  });

  it('should handle unknown error on user login', () => {
    const loginFormValue = {
      username: 'testUser',
      password: 'testPassword',
    };
    const error = {};
    jest.spyOn(webServiceMock, 'login').mockReturnValue(throwError(error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    component.loginForm = formBuilder.group(loginFormValue);
    component.onSubmitUserLogin();
  
    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error:', error);
    expect(component.errorMessage).toBe('Login failed: Unknown error');
  });
});