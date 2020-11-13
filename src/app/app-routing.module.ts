import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordDTO } from './dtos/resetPassword.dto';
import { LoginFormComponent } from './my-forms/login-form/login-form.component';
import { RegisterFormComponent } from './my-forms/register-form/register-form.component';
import { ResetPasswordFormComponent } from './my-forms/reset-password-form/reset-password-form.component';
import { SendMailResetPasswordFormComponent } from './my-forms/send-mail-reset-password-form/send-mail-reset-password-form.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'reset_password', component: SendMailResetPasswordFormComponent },
  { path: 'reset_password/:user/:token', component:ResetPasswordFormComponent },
  { path: '**', component:LoginFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
