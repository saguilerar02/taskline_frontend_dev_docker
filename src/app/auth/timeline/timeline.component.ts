import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { NewTaskDTO } from 'src/app/dtos/newTask.dto';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';
import { AddContributorsDialogComponent } from '../add-contributors-dialog/add-contributors-dialog.component';
import { AddRemindersDialogComponent } from '../add-reminder-dialog/add-reminder-dialog.component';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport, {static: true})
  viewPort: CdkVirtualScrollViewport;

  public subject: BehaviorSubject<Array<TaskDTO>>;
  public items: Array<TaskDTO>;
  private lastTask: string;
  private lastDate: string;
  public totalTasks: number;
  public recargable: boolean;
  constructor(public taskService: TaskService, private snackbar: MatSnackBar, private dialog: MatDialog) {

    this.items  = new Array<TaskDTO>();
    this.subject = new BehaviorSubject<Array<TaskDTO>>(this.items);
    this.lastTask = '';
    this.lastDate = '';
    this.totalTasks = 1;
    this.recargable = true;
  }

  ngOnInit(): void {
  }
  getTimeline(){
    if (this.recargable){
      this.recargable = false;
      const end = this.viewPort.getRenderedRange().end;
      if (this.items.length < this.totalTasks && this.items.length === end){
        this.taskService.getTimeline(this.lastTask, this.lastDate).subscribe({
            next: (data) => {
              this.totalTasks = data.items;
              if (this.items.length < data.items && data.timeline.length > 0) {
                this.items.push(...data.timeline);
                this.items.sort((a, b) => (new Date(a.archivementDateTime).getTime() - new Date(b.archivementDateTime).getTime()));
                this.lastTask = this.items[this.items.length - 1]._id;
                this.lastDate = this.items[this.items.length - 1].archivementDateTime.toString();
                this.subject.next(this.items);
              }
              this.recargable = true;
            },
            error: (error) => {
              this.snackbar.open(error.error);
              setTimeout(() => {
                this.snackbar.dismiss();
              }, 1000);
            },
          });
      }

    }
    }

    addTask(): void {
      const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
        height: '70vh',
        maxWidth: '75vw',
        data: {task: new NewTaskDTO()}
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result){
            if ((this.items.length>0 && result.task.archivementDateTime < this.items[this.items.length - 1].archivementDateTime) || this.items.length<10){
              this.items.push(result.task);
              this.items.sort((a, b) => (new Date(a.archivementDateTime).getTime() - new Date(b.archivementDateTime).getTime()));
              this.lastTask = this.items[this.items.length - 1]._id;
              this.subject.next(this.items);
            }
            this.snackbar.open('La tarea se ha guardado con éxito');
            setTimeout(() => {
              this.snackbar.dismiss();
            }, 1000);
          }
      }
      );
    }

    inspectTask(task: TaskDTO){
      let t = new TaskDTO(task);
      const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
        height: '70vh',
        maxWidth: '75vw',
        data: {task:t}
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result){
            this.snackbar.open('La tarea se ha guardado con éxito');
            setTimeout(() => {
              this.snackbar.dismiss();
            }, 1000);
          }
        }
      );
    }

    addContributors(task: TaskDTO){
      const dialogRef = this.dialog.open(AddContributorsDialogComponent, {
        height: '70vh',
        maxWidth: '75vw',
        data: {task}
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result){
            this.snackbar.open('Los contribuidores de la tarea se han actualizado con éxito');
            setTimeout(() => {
              this.snackbar.dismiss();
            }, 1000);
          }
        }
      );
    }
    addReminder(task: TaskDTO){
      const dialogRef = this.dialog.open(AddRemindersDialogComponent, {
        height: '70vh',
        maxWidth: '75vw',
        data: {task}
      });
  
      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result){
            this.snackbar.open('Reminders añadidos con éxito');
            setTimeout(() => {
              this.snackbar.dismiss();
            }, 1000);
          }
        }
      );
    }

    deleteTask(id: string){
      this.items = this.items.filter((task) => task._id !== id);
      this.subject.next(this.items);

    }
    updateTask(task: TaskDTO){
      const index = this.items.findIndex((t) => {t._id === task._id; });
      this.items[index] = task;
      this.deleteTask(task._id);

    }
}
