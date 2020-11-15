import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginDTO } from 'src/app/dtos/login.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  public formGroup: FormGroup;
  public dto: LoginDTO;
  public errors: {
    email: string;
    password: string;
  };
    email: AbstractControl;
    password: AbstractControl;

  hide: boolean;
  isLoading: boolean;

  constructor(public userService: UsersService, private snackbar: MatSnackBar, private fb: FormBuilder, public authRouter:Router ) {
    this.isLoading = false;
    this.hide = true;
    this.errors = {
      email: null,
      password: null
    };

    this.dto = new LoginDTO();
    this.hide = true;
    this.isLoading = false;
  }

    ngOnInit(): void {
      this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
      this.email = this.formGroup.controls.email;
      this.password = this.formGroup.controls.password;
      setTimeout(() => {
        this.isLoading = false;
        this.snackbar.dismiss();
      }, 1000);
    }


    getErrorMessage(key: string): string {
      if (this.formGroup.get(key).hasError('required')){
        return `El campo es requerido`;
      }
      if (this.formGroup.get(key).hasError('invalid')){
        return this.errors[key];
      }
      if (key === 'email' && this.formGroup.get(key).hasError('email')){
        return 'El email es inválido';
      }

    }

public login(): void{
  if (this.formGroup.valid){
    this.isLoading = true;
    this.userService.login(this.dto).subscribe({
      next: (data: any) => {
        if (data.token){
          localStorage.setItem('AUTHTOKEN', data.token);
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
            this.authRouter.navigateByUrl("/auth/home");
          }, 1000);
        }
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
              this.formGroup.controls[key].reset();
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

