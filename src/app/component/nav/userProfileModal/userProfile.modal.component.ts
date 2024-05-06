import { Component, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { WebService } from '../../../web.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './userProfile.modal.component.html',
  styleUrls: ['./userProfile.modal.component.css'],
})
export class UserProfileModalComponent {
  constructor(
    public webService: WebService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  editForm: any;
  decodedToken: any;
  errorMessage: string = '';
  emailIsValid: boolean = false;
  passwordIsValid: boolean = false;

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.decodedToken = jwtDecode(token);
    } else {
      this.router.navigateByUrl('/');
    }

    this.editForm = this.formBuilder.group({
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
          Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-]+$'),
        ],
      ],
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  updateEmailValidity() {
    this.emailIsValid = this.editForm.controls.email.valid;
  }

  updatePasswordValidity() {
    this.passwordIsValid = this.editForm.controls.password.valid;
  }

  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control.touched && control.invalid;
  }

  isIncomplete(): boolean {
    return this.editForm.invalid || this.editForm.pristine;
  }

  onSubmitEditProfile() {
    this.webService.updateUser(this.decodedToken.userID, this.editForm.value).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('token', response.token);
        this.editForm.reset();
        setTimeout(() => {
          const updatedToken = sessionStorage.getItem('token')!;
          this.cd.detectChanges();
          this.decodedToken = jwtDecode(updatedToken);
          this.errorMessage = '';
        }, 1);
      },
      error: (error: any) => {
        console.error('HTTP error:', error);
        this.errorMessage = error?.error?.message || 'Unknown error';
      },
    });
  }

  onSubmitDeleteProfile() {
    if (this.passwordIsValid) {
      this.webService.deleteUser(this.decodedToken.userID).subscribe({
        next: (response) => {
          sessionStorage.setItem('token', '');
          this.closeModal();
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.error('HTTP error:', error);
          this.errorMessage = 'Failed to delete profile. Please try again.';
        },
      });
    }
  }
}