import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthHomePageComponent } from './auth/auth-home-page/auth-home-page.component';
import { CreateTaskDialogComponent } from './auth/create-task-dialog/create-task-dialog.component';
import { TimelineComponent } from './auth/timeline/timeline.component';
import { LoginFormComponent } from './my-forms/login-form/login-form.component';
import { RegisterFormComponent } from './my-forms/register-form/register-form.component';
import { ResetPasswordFormComponent } from './my-forms/reset-password-form/reset-password-form.component';
import { SendMailResetPasswordFormComponent } from './my-forms/send-mail-reset-password-form/send-mail-reset-password-form.component';
import { UserProfileComponent } from './my-forms/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'public/login', pathMatch: 'full', component: LoginFormComponent},
  { path: 'public/register', pathMatch: 'full', component: RegisterFormComponent },
  {path: 'public/sendMailPassReset', component: SendMailResetPasswordFormComponent},
  { path: 'public/reset_password/:user/:token', component: ResetPasswordFormComponent},
  { path: 'auth', component: AuthHomePageComponent,
  children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {
      path: 'home',
      component: TimelineComponent,
    },
    {
      path: 'new_task',
      component: CreateTaskDialogComponent,
    },
    {
      path: 'user',
      component: UserProfileComponent,
      pathMatch: 'full'
    },
    { path: '**', component: TimelineComponent}
  ], },
  { path: '**', component: LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
