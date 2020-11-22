import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateTaskDialogComponent } from 'src/app/auth/create-task-dialog/create-task-dialog.component';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';

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

  constructor(private taskService: TaskService, private snackbar: MatSnackBar) { }

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

  setStatus(status: string){
    this.task.status = status;
    this.taskService.update(this.task).subscribe({
      next: (data: any) => {
        if (data.type =='SUCCESS'){
          this.updateTask.emit(this.task);
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
