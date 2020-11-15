import { Component, Input, OnInit } from '@angular/core';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';

@Component({
  selector: 'app-preview-simple-task',
  templateUrl: './preview-simple-task.component.html',
  styleUrls: ['./preview-simple-task.component.scss']
})
export class PreviewSimpleTaskComponent implements OnInit {

  @Input() task: TaskDTO;

  constructor() { }

  ngOnInit(): void {
  }

}
