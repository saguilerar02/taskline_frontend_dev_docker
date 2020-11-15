import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';

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
  constructor(public taskService: TaskService, private snackbar: MatSnackBar) {

    this.items  = new Array<TaskDTO>();
    this.lastTask = '';
    this.totalTasks = 1;
    this.recargable = true;
  }

  ngOnInit(): void {
    this.viewPort.scrollToIndex(this.items.length-1)

  }

  getTimeline(){

    if (this.recargable){
      console.log(this.items);
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
                this.viewPort.scrollToIndex(this.items.length);
              }
              this.recargable = true;
              this.lastTask = data.timeline[data.timeline.length - 1]._id;
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
}
