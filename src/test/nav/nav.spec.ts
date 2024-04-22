import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { WebService } from 'src/app/web.service';
import { NavComponent } from 'src/app/component/nav/nav.component';
import { DeviceModalComponent } from 'src/app/component/nav/deviceModal/device.modal.component';
import { ThresholdModalComponent } from 'src/app/component/nav/thresholdModal/threshold.modal.component';
import { UserProfileModalComponent } from 'src/app/component/nav/userProfileModal/userProfile.modal.component';

describe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let router: jest.Mocked<Router>;
    let modalService: jest.Mocked<NgbModal>;  // Declare modalService as a Jest mocked type

    beforeEach(async () => {

        const routerMock = { navigateByUrl: jest.fn() };

        const modalServiceMock = {
            open: jest.fn()
        };

        Object.defineProperty(window, 'sessionStorage', {
            value: {
                getItem: jest.fn(() => 'some-token'),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true
        });

        await TestBed.configureTestingModule({
            declarations: [NavComponent],
            imports: [RouterTestingModule, HttpClientModule, NgbModule],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: NgbModal, useValue: modalServiceMock },
                WebService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as jest.Mocked<Router>;
        modalService = TestBed.inject(NgbModal) as jest.Mocked<NgbModal>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open device modal when onOpenDeviceModal is called', () => {
        component.onOpenDeviceModal();
        expect(modalService.open).toHaveBeenCalledWith(DeviceModalComponent, { size: 'lg' });
    });

    it('should open threshold modal when onOpenThresholdModal is called', () => {
        component.onOpenThresholdModal();
        expect(modalService.open).toHaveBeenCalledWith(ThresholdModalComponent, { windowClass: 'custom-large-modal' });
    });

    it('should open user profile modal when onOpenUserProfileModal is called', () => {
        component.onOpenUserProfileModal();
        expect(modalService.open).toHaveBeenCalledWith(UserProfileModalComponent, { size: 'lg' });
    });

    it('should clear token and navigate to home on logout', () => {
        component.onSubmitLogout();
        expect(sessionStorage.setItem).toHaveBeenCalledWith('token', '');
        expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
});
