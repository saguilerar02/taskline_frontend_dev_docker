import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewSimpleTaskComponent } from './preview-simple-task/preview-simple-task.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [PreviewSimpleTaskComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    PreviewSimpleTaskComponent
  ]
})
export class TasksModule { }
