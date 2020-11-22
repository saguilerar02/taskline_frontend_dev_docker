import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ListDTO } from 'src/app/dtos/list.dto';
import { NewTaskDTO } from 'src/app/dtos/newTask.dto';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { ToolbarProfileDTO } from 'src/app/dtos/toolbarProfile.dto';
import { TaskService } from 'src/app/services/task.service';
import { TasklistService } from 'src/app/services/tasklist.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
    public formGroup: FormGroup;
    public errors: {
      goal: string;
      description: string;
      archivementDateTime: string;
      createdAt: string;
      idTasklist: string
    };

    public lists: Array<ListDTO>;
    public task: NewTaskDTO;
    public goal: AbstractControl;
    public description: AbstractControl;
    public archivementDateTime: AbstractControl;
    public createdAt: AbstractControl;
    public idTasklist: AbstractControl;
    public status: AbstractControl;

    public isLoading ;

  constructor(
    public taskService: TaskService,
    public listsService: TasklistService,
    public usersService: UsersService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private authRouter: Router,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.task = data.task;
      this.errors = {
        goal: null,
        description: null,
        archivementDateTime: null,
        createdAt: null,
        idTasklist: null,
      };
      this.isLoading = false;
      this.lists = new Array<ListDTO>();
    }


    ngOnInit(): void {
      this.formGroup = this.fb.group({
        goal: ['', Validators.required],
        description: ['', Validators.required],
        archivementDateTime: ['', Validators.required],
        idTasklist: ['', () => this.task.idTasklist != null]
      });
      this.goal = this.formGroup.controls.goal;
      this.description = this.formGroup.controls.description;
      this.archivementDateTime = this.formGroup.controls.archivementDateTime;
      this.idTasklist = this.formGroup.controls.idTasklist;

      this.getUserLists();
    }

    getUserLists(){
      this.listsService.getUserLists().subscribe({
        next: (data) => {
          if (data.lists.length > 0) {
            const newArray = new Array(...this.lists);
            newArray.push(...data.lists);
            this.lists = newArray;
          }
        },
        error: (error) => {
          console.log(error.error);
        }
      });
    }

      onNoClick(): void {
        this.dialogRef.close();
      }

      getErrorMessage(key: string): string {
      if (this.formGroup.get(key).hasError('required')){
        return `El campo es requerido`;
      }
      if (this.formGroup.get(key).hasError('invalid')){
        return this.errors[key];
      }
    }

    save(){
      if (this.formGroup.valid){
        this.isLoading = true;
        this.taskService.create(this.task).subscribe({
            next: (data: any) => {
              this.manageSuccess(data);
            },
            error: (error: any) => {
              this.manageError(error);
            }
          });
      }
    }

    onDate(event){
      this.task.archivementDateTime = event
    }


    private manageSuccess(data: any){
      if (data.type === 'SUCCESS'){
        this.snackbar.open(data.msg);
        setTimeout(() => {
          this.isLoading = false;
          this.snackbar.dismiss();
          this.dialogRef.close({task: this.data});
        }, 1000);
      }
    }
    private manageError(error: any){
      console.log(error);
      switch (error.type) {
              case 'ERROR': {
                 this.snackbar.open(error.error);
              }
                            break;
              case 'VALIDATION_ERROR': {
                console.log(error)
                Object.keys(this.task).forEach((key) => {
                  this.formGroup.controls[key].setErrors({invalid: true});
                  this.errors[key] = error.error[key];
              });
              }
                                       break;
              default: {
                this.snackbar.open('Ha ocurrido un error inseperado, intentelo de nuevo más tarde');
              }
                       break;
           }
      setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
          }, 1000);
    }
}
