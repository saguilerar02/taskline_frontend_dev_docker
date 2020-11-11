import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { LoginFormComponent } from './my-forms/login-form/login-form.component';
import { RegisterFormComponent } from './my-forms/register-form/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginFormComponent, RegisterFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    LoginFormComponent,
    RegisterFormComponent
  ]
})
export class MyFormsModule { }
