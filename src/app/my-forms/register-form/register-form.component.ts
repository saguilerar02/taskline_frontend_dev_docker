import { Component, OnInit } from '@angular/core';
import { AbstractControl,   FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { RegisterDTO } from 'src/app/dtos/register.dto';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  public formGroup: FormGroup;
  public dto: RegisterDTO;
  public errors: {
    email: string;
    username: string;
    password: string;
    name: string;
    birthDate: string;
  };
    email: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    name: AbstractControl;
    birthDate: AbstractControl;

  hide: boolean;
  isLoading: boolean;


  constructor(public userService: UsersService, private snackbar: MatSnackBar, private fb: FormBuilder,  public router:Router) {
    this.isLoading = false;
    this.hide = true;
    this.errors = {
      email: null,
      username: null,
      password: null,
     name: null,
      birthDate: null
    };

    this.dto = new RegisterDTO();
  }

    ngOnInit(): void {
      this.formGroup = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      birthDate: ['']
    });
      this.email = this.formGroup.controls.email;
      this.username = this.formGroup.controls.username;
      this.password = this.formGroup.controls.password;
      this.name = this.formGroup.controls.name;
      this.birthDate = this.formGroup.controls.birthDate;
    }


    getErrorMessage(key: string): string {
        if (this.formGroup.get(key).hasError('required')){
          return `El campo es requerido`;
        }
        if (this.formGroup.get(key).hasError('invalid')){
          return this.errors[key];
        }


      }

  public register(): void{
    if (this.formGroup.valid){
      this.isLoading = true;
      this.userService.register(this.dto).subscribe({
        next: (data: any) => {
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
            this.router.navigateByUrl("/public/login")
          }, 2000);
        },
        error: (error: any) => {
          console.log(this.dto);
          let err = '';
          switch (error.type) {
            case 'ERROR': {
               err += error.error;
               this.snackbar.open(err);
            }             break;
            case 'DUPLICATED': {
                err += error.error;
                this.snackbar.open(err);
            }                  break;
            case 'VALIDATION_ERROR': {
              Object.keys(error.error).forEach((key) => {
                this.formGroup.controls[key].setErrors({invalid: true});
                this.errors[key] = error.error[key];
            });
            }                        break;
            default: {
              this.snackbar.open('Ha ocurrido un error inseperado, intentelo de nuevo más tarde');
            }        break;
         }
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
          }, 2000);
        }
      });
    }

  }


}

