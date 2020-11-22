import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';
import { AddContributorsDialogComponent } from '../add-contributors-dialog/add-contributors-dialog.component';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport, {static: true})
  viewPort: CdkVirtualScrollViewport;

  public items: Array<TaskDTO>;
  private lastTask: string;
  private totalTasks: number;
  public recargable: boolean;
  constructor(public taskService: TaskService, private snackbar: MatSnackBar, private dialog: MatDialog) {

    this.items  = new Array<TaskDTO>();
    this.lastTask = '';
    this.totalTasks = 1;
    this.recargable = true;
  }

  ngOnInit(): void {
  }

  getTimeline(){
    console.log("hola")
    if (this.recargable){
      this.recargable = false;
      const endData = this.viewPort.getRenderedRange().end;
      if (this.items.length < this.totalTasks && endData === this.items.length){
          this.taskService.getTimeline(this.lastTask).subscribe({
            next: (data) => {
              this.totalTasks = data.items;
              if (this.items.length < data.items && data.timeline.length > 0) {
                const newArray = new Array(...this.items);
                newArray.push(...data.timeline);
                this.items = newArray;
                this.items.sort((a, b) =>(new Date(a.archivementDateTime).getTime() - new Date(b.archivementDateTime).getTime()));
                this.lastTask = this.items[this.items.length-1]._id;
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
    
    inspectTask(task:TaskDTO){
      const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
        height: '80vh',
        maxWidth: '75vw',
        data: {task: task}
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

    addContributors(task:TaskDTO){
      const dialogRef = this.dialog.open(AddContributorsDialogComponent, {
        height: '80vh',
        maxWidth: '75vw',
        data: {task: task}
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

    deleteTask(id:string){
      this.items = this.items.filter((task)=>{return task._id!==id});

    }
    updateTask(task:TaskDTO){
      let index = this.items.findIndex((t)=>{t._id === task._id})
      this.items[index] = task;
      this.deleteTask(task._id);

    }
}
