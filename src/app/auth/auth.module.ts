import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHomePageComponent } from './auth-home-page/auth-home-page.component';
import { MaterialModule } from '../material.module';
import {  RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TasksModule } from '../tasks/tasks.module';


@NgModule({
  declarations: [AuthHomePageComponent, TimelineComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ScrollingModule,
    TasksModule
  ],
  exports:[
    AuthHomePageComponent,
    TimelineComponent
  ]
})
export class AuthModule { }
