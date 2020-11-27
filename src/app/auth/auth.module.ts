import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHomePageComponent } from './auth-home-page/auth-home-page.component';
import { MaterialModule } from '../material.module';
import {  RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TasksModule } from '../tasks/tasks.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';
import { AddContributorsDialogComponent } from './add-contributors-dialog/add-contributors-dialog.component';
import { AddRemindersDialogComponent } from './add-reminder-dialog/add-reminder-dialog.component';



@NgModule({
  declarations: [AuthHomePageComponent, TimelineComponent, CreateTaskDialogComponent, AddContributorsDialogComponent, AddRemindersDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ScrollingModule,
    TasksModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    AuthHomePageComponent,
    TimelineComponent,
    CreateTaskDialogComponent, 
    AddContributorsDialogComponent, 
    AddRemindersDialogComponent
  ]
})
export class AuthModule { }
