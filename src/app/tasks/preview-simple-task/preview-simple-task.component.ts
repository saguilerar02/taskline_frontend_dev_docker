import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddRemindersDialogComponent } from 'src/app/auth/add-reminder-dialog/add-reminder-dialog.component';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';
import { AppUtilsService } from 'src/app/utils/app-utils.service';

@Component({
  selector: 'app-preview-simple-task',
  templateUrl: './preview-simple-task.component.html',
  styleUrls: ['./preview-simple-task.component.scss']
})
export class PreviewSimpleTaskComponent implements OnInit {

  @Input() task: TaskDTO;
  @Output() deleteTask = new EventEmitter<string>();
  @Output() updateTask = new EventEmitter<TaskDTO>();
  @Output() inpectTask = new EventEmitter<TaskDTO>();
  @Output() addContributors = new EventEmitter<TaskDTO>();
  @Output() addReminders = new EventEmitter<TaskDTO>();

  constructor(private taskService: TaskService, private snackbar: MatSnackBar, public appUtils:AppUtilsService) { }

  ngOnInit(): void {
  }

  delete(){
    this.taskService.delete(this.task._id).subscribe({
      next: (data: any) => {

        if (data.type =='SUCCESS'){
          this.deleteTask.emit(this.task._id);
          this.snackbar.open(data.msg);
          setTimeout(() => {this.snackbar.dismiss(); }, 2000);
        }
      },
      error: (error) => {
        if (error.type =='ERROR'){
          this.snackbar.open(error.error);
          setTimeout(() => {this.snackbar.dismiss(); }, 2000);
        }
      }
    });
  }
}
