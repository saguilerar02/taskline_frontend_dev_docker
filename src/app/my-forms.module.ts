import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { LoginFormComponent } from './my-forms/login-form/login-form.component';
import { RegisterFormComponent } from './my-forms/register-form/register-form.component';
import { ResetPasswordFormComponent } from './my-forms/reset-password-form/reset-password-form.component';
import { SendMailResetPasswordFormComponent } from './my-forms/send-mail-reset-password-form/send-mail-reset-password-form.component';
import { UserProfileComponent } from './my-forms/user-profile/user-profile.component';

@NgModule({
  declarations: [LoginFormComponent, RegisterFormComponent, ResetPasswordFormComponent, SendMailResetPasswordFormComponent, UserProfileComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  exports:[
    LoginFormComponent,
    RegisterFormComponent,
    ResetPasswordFormComponent, 
    SendMailResetPasswordFormComponent,
    AppRoutingModule
  ]
})
export class MyFormsModule { }
