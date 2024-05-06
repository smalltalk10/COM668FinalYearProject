import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { WebService } from '../../../app/web.service';
import { DeviceModalComponent } from 'src/app/component/nav/deviceModal/device.modal.component';

describe('DeviceModalComponent', () => {
  let component: DeviceModalComponent;
  let fixture: ComponentFixture<DeviceModalComponent>;
  let webServiceMock: Partial<WebService>;
  let activeModalMock: Partial<NgbActiveModal>;
  let formBuilderMock: Partial<any>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    const validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    jest.mock('jwt-decode', () =>
      jest.fn((token: string) => ({
        userID: '123',
        username: 'testUser',
      }))
    );

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
      getCurrentMeasurements: jest.fn(() => of({ temp: 20, humidity: 50 })),
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
      declarations: [DeviceModalComponent],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: NgbActiveModal, useValue: activeModalMock },
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceModalComponent);
    component = fixture.componentInstance;

    component.decodedToken = { userID: '123', username: 'testUser' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate to root if token is not available', () => {
      sessionStorage.getItem = jest.fn().mockReturnValueOnce(null);

      component.ngOnInit();

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });

  it('should return "Online" if device is online', () => {
    const datetime = new Date().toISOString();
    const onlineStatus = component.getOnlineStatus(datetime);

    expect(onlineStatus).toBe('Online');
  });

  it('should return "Offline" if device is offline', () => {
    const datetime = new Date();
    datetime.setMinutes(datetime.getMinutes() - 15);
    const offlineStatus = component.getOnlineStatus(datetime.toISOString());

    expect(offlineStatus).toBe('Offline');
  });

  it('should return "<1 min ago" if time difference is less than a minute', () => {
    const currentTime = new Date();
    const datetime = new Date(currentTime);
    datetime.setSeconds(datetime.getSeconds() - 30);
    const relativeTime = component.getRelativeTime(datetime.toISOString());

    expect(relativeTime).toBe('<1 min ago');
  });

  it('should return the correct time difference in minutes', () => {
    const currentTime = new Date();
    const datetime = new Date(currentTime);
    datetime.setMinutes(datetime.getMinutes() - 5);
    const relativeTime = component.getRelativeTime(datetime.toISOString());

    expect(relativeTime).toBe('5 mins ago');
  });
});
