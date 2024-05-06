import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserProfileModalComponent } from '../../../app/component/nav/userProfileModal/userProfile.modal.component';
import { WebService } from '../../../app/web.service';

describe('UserProfileModalComponent', () => {
  let component: UserProfileModalComponent;
  let fixture: ComponentFixture<UserProfileModalComponent>;
  let webServiceMock: Partial<WebService>;
  let activeModalMock: Partial<NgbActiveModal>;
  let formBuilderMock: Partial<any>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
    jest.mock('jwt-decode', () => ({
      __esModule: true,
      default: () => ({ userID: '123', username: 'testUser' }),
    }));
  
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => validToken),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    webServiceMock = {
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    activeModalMock = {
      dismiss: jest.fn(),
    };

    formBuilderMock = {
      group: jest.fn(() => ({
        controls: {
          email: {
            valid: false,
            pristine: true,
            setValue: jest.fn(),
            get: jest.fn((controlName) => ({
              invalid: false,
              dirty: false,
              touched: false,
            })),
          },
          password: {
            setValue: jest.fn(),
          },
        },
        get: jest.fn((controlName) => ({
          invalid: true,
          dirty: true,
          touched: true,
        })),
        invalid: false,
        pristine: true,
      })),
    };

    routerMock = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfileModalComponent],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: NgbActiveModal, useValue: activeModalMock },
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileModalComponent);
    component = fixture.componentInstance;

    component.decodedToken = { userID: '123', username: 'testUser' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(activeModalMock.dismiss).toHaveBeenCalled();
  });

  it('should update email validity', () => {
    component.editForm = { controls: { email: { valid: true } } } as any;
    component.updateEmailValidity();
    expect(component.emailIsValid).toBe(true);
  });

  it('should check if control is invalid', () => {
    component.editForm = {
      get: jest
        .fn()
        .mockReturnValue({ invalid: true, dirty: true, touched: true }),
    } as any;
    expect(component.isInvalid('email')).toBe(true);
  });

  it('should check if form is incomplete', () => {
    component.editForm = { invalid: true, pristine: true } as any;
    expect(component.isIncomplete()).toBe(true);
  });

  it('should submit edit profile', () => {
    component.decodedToken = { userID: '123' };

    component.editForm = {
      value: { email: 'test@example.com', password: 'password' },
      controls: {
        email: {
          setValue: jest.fn()
        },
        password: {
          setValue: jest.fn()
        }
      }
    };

    const response = { token: 'new_token' };
    const editUserSpy = jest.spyOn(webServiceMock, 'updateUser').mockReturnValue(of(response));
    const setItemSpy = jest.spyOn(sessionStorage, 'setItem');

    component.onSubmitEditProfile();
  
    expect(editUserSpy).toHaveBeenCalledWith('123', {
      email: 'test@example.com',
      password: 'password'
    });
    expect(setItemSpy).toHaveBeenCalledWith('token', 'new_token');
    expect(component.editForm.controls.email.setValue).toHaveBeenCalledWith('');
    expect(component.editForm.controls.password.setValue).toHaveBeenCalledWith('');
  });

  it('should handle edit profile error', () => {
    const error = { error: { message: 'Error message' } };
    jest.spyOn(webServiceMock, 'updateUser').mockReturnValue(throwError(error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    component.onSubmitEditProfile();

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error:', error);
    expect(component.errorMessage).toBe('Error message');
  });

  it('should submit delete profile', () => {
    component.decodedToken = { userID: '123' };
    sessionStorage.setItem('token', 'some_token');
    const response = 'success';
    const deleteUserSpy = jest
      .spyOn(webServiceMock, 'deleteUser')
      .mockReturnValue(of(response));

    component.onSubmitDeleteProfile();

    expect(deleteUserSpy).toHaveBeenCalledWith('123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('token', '');
    expect(activeModalMock.dismiss).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle delete profile error', () => {
    const error = 'Error deleting profile';
    jest.spyOn(webServiceMock, 'deleteUser').mockReturnValue(throwError(error));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    component.onSubmitDeleteProfile();

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error:', error);
  });
});