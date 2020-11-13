import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginDTO } from 'src/app/dtos/login.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-send-mail-reset-password-form',
  templateUrl: './send-mail-reset-password-form.component.html',
  styleUrls: ['./send-mail-reset-password-form.component.scss']
})
export class SendMailResetPasswordFormComponent implements OnInit {

  public formGroup: FormGroup;
  public dto: LoginDTO;

  public errors: {
    email: string;
  };
    emailControl: AbstractControl;

  hide: boolean;
  isLoading: boolean;

  constructor(public userService: UsersService, private snackbar: MatSnackBar, private fb: FormBuilder ) {
    this.isLoading = false;
    this.hide = true;
    this.errors = {
      email: null,
    };
    this.dto = new LoginDTO();
    this.hide = true;
    this.isLoading = false;
  }

    ngOnInit(): void {
      this.formGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    });
      this.emailControl = this.formGroup.controls.email;
    }

    getErrorMessage(key: string): string {
      if (this.formGroup.get(key).hasError('required')){
        return `El campo es requerido`;
      }
      if (this.formGroup.get(key).hasError('invalid')){
        this.formGroup.controls[key].setErrors({invalid: false});
        return this.errors[key];
      }
      if (key === 'email' && this.formGroup.get(key).hasError('email')){
        return 'El email es inválido';
      }

    }

  public sendMailResetPassword(): void{
    if (this.formGroup.valid){
      this.isLoading = true;
      this.userService.sendMailResetPassword(this.dto).subscribe({
        next: (data: any) => {
            this.snackbar.open(data.msg);
            this.isLoading = false;
            setTimeout(() => {
              this.snackbar.dismiss();
            }, 2000);
        },
        error: (error: any) => {
          let err = '';
          switch (error.type) {
            case 'ERROR': {
               err += error.error;
               this.snackbar.open(err);
            }
                          break;
            case 'BAD_CREDENTIALS': {
              Object.keys(this.dto).forEach((key) => {
                this.formGroup.controls[key].setErrors({invalid: true});
                this.errors[key] = error.error;
            });
            }
                                    break;
            default: {
              this.snackbar.open('Ha ocurrido un error inseperado, intentelo de nuevo más tarde');
            }
                     break;
         }
          this.isLoading = false;
          this.snackbar.dismiss();
        }
      });
    }

  }
}
