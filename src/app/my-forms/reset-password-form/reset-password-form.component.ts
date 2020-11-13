import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordDTO } from 'src/app/dtos/resetPassword.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {

  public formGroup: FormGroup;
  public dto: ResetPasswordDTO;
  public errors: {
    pass1: string;
    pass2: string;
  };
  public pass1: AbstractControl;
  public pass2: AbstractControl;

  public user: string;
  public token: string;
  public hide: boolean;
  public isLoading: boolean;

  constructor(private route: ActivatedRoute, public userService: UsersService, private snackbar: MatSnackBar, private fb: FormBuilder ) {
    this.isLoading = false;
    this.hide = true;
    this.user ='';
    this.errors = {
      pass1: null,
      pass2: null
    };

    this.dto = new ResetPasswordDTO();
    this.hide = true;
    this.isLoading = false;
  }

    ngOnInit(): void {
      this.formGroup = this.fb.group({
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
    });
      this.pass1 = this.formGroup.controls.pass1;
      this.pass2 = this.formGroup.controls.pass2;
      this.route.params.subscribe(params => {
        this.user = params.user;
        this.token = params.token;
     });
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

public resetPassword(): void{
  if (this.formGroup.valid){
    this.isLoading = true;
    this.userService.resetPassword(this.dto, this.user, this.token).subscribe({
      next: (data: any) => {
        if (data.msg){
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
          }, 1000);
        }
      },
      error: (error: any) => {
        switch (error.type) {
          case 'ERROR': {
             this.snackbar.open(error.error);
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
        setTimeout(() => {
        this.isLoading = false;
        this.snackbar.dismiss();
      }, 1000);
      }
    });
  }

}
}
