import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterDTO } from 'src/app/dtos/register.dto';
import { CompleteUserProfileDTO } from 'src/app/dtos/userProfile.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public imageGroup: FormData;
  public updateGroup: FormGroup;

  public image: File;
  public img:string

  public dto: CompleteUserProfileDTO;
  public errors: {
    email: string
    username: string
    name: string
    phoneNumber: string
    birthDate: Date
  };

    email: AbstractControl;
    username: AbstractControl;
    name: AbstractControl;
    phoneNumber: AbstractControl;
    birthDate: AbstractControl;


  hide: boolean;
  isLoading: boolean;


  constructor(public userService: UsersService, private snackbar: MatSnackBar, private fb: FormBuilder,  public router: Router) {
    this.isLoading = false;
    this.hide = true;
    this.errors = {
      email: null,
      username: null,
      name: null,
      phoneNumber: null,
      birthDate: null,
    };
    this.imageGroup = new FormData();
    this.dto = new CompleteUserProfileDTO();
  }

    ngOnInit(): void {
      this.updateGroup = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.pattern(/^(\+34|0034|34)?[6789]\d{8}$/)],
      birthDate:  ['']
    });

      this.email = this.updateGroup.controls.email;
      this.username = this.updateGroup.controls.username;
      this.name = this.updateGroup.controls.name;
      this.phoneNumber = this.updateGroup.controls.phoneNumber;
      this.birthDate = this.updateGroup.controls.birthDate;
      this.getUserProfile();
    }

    openFileSelector(){
      document.getElementById("input-image").click()
    }

    getErrorMessage(key: string): string {
        if (this.updateGroup.get(key).hasError('required')){
          return `El campo es requerido`;
        }
        if (this.updateGroup.get(key).hasError('invalid')){
          return this.errors[key];
        }
        if (this.updateGroup.get(key).hasError('pattern')){
          return this.errors[key]= "El numero de teléfono es invalido. Ejemplos válidos: +346434... 00349343... 347234..)?[6789";
        }
    }

    getUserProfile(){
      this.isLoading = true
        this.userService.getUserProfile().subscribe({
          next: (data: any) => {
            this.dto = data.user;
            this.isLoading = false;
          },
          error: (error: any) => {
            if(error.type === 'ERROR'){
              this.snackbar.open(error.error);
            }
           
            setTimeout(() => {
              this.isLoading = false;
              this.snackbar.dismiss();
            }, 2000);
          }
        });
    }

    updateUser(){
        if (this.updateGroup.valid){
          this.isLoading = true;
          this.userService.updateUser(this.dto).subscribe({
            next: (data: any) => {
              this.snackbar.open(data.msg);
              this.getUserProfile();
              setTimeout(() => {
                this.isLoading = false;
                this.snackbar.dismiss();
              }, 2000);
            },
            error: (error: any) => {
              let err = '';
              console.log(error);
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
                    this.updateGroup.controls[key].setErrors({invalid: true});
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

    getImage(event){
      if(event.target.files[0]){
        this.image = event.target.files[0];
        document.getElementById("mat-button-img-selector").textContent = this.image.name
      }
      
    }


    updateProfileImage(){
      if (this.image){
        this.imageGroup = new FormData();
        this.imageGroup.append('profileImage', this.image);
        this.userService.updateProfileImage(this.imageGroup).subscribe({
          next: (data: any) => {
            this.snackbar.open(data.msg);
            this.image=null;
            setTimeout(() => {
              this.isLoading = false;
              this.snackbar.dismiss();
              window.location.reload();
            }, 1000);
          },
          error: (error: any) => {
            console.log(error);
            if (error.error){
              console.log(error);
              this.snackbar.open( error.error);
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
