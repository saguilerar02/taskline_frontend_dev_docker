import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListDTO } from 'src/app/dtos/list.dto';
import { NewTaskDTO } from 'src/app/dtos/newTask.dto';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { TaskService } from 'src/app/services/task.service';
import { TasklistService } from 'src/app/services/tasklist.service';
import { UsersService } from 'src/app/services/users.service';
import { AppUtilsService } from 'src/app/utils/app-utils.service';

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
      idTasklist: string
    };

    public lists: Array<ListDTO>;
    public task: any;
    public goal: AbstractControl;
    public description: AbstractControl;
    public archivementDateTime: AbstractControl;
    public idTasklist: AbstractControl;
    public disabled: boolean;

    public isLoading ;

  constructor(
    public taskService: TaskService,
    public listsService: TasklistService,
    public usersService: UsersService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    public appUtils: AppUtilsService,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data && data.task){
        this.task = data.task;
      }else{
        this.task = new NewTaskDTO();
      }

      this.task.archivementDateTime = new Date(this.task.archivementDateTime);


      this.errors = {
        goal: null,
        description: null,
        archivementDateTime: null,
        idTasklist: null,
      };
      this.isLoading = false;
      this.lists = new Array<ListDTO>();
    }


    ngOnInit(): void {
      this.getUserLists();
      if (this.task.createdBy){
        this.disabled = this.appUtils.createdByUser(this.task.createdBy);
      }
      this.formGroup = this.fb.group({
        goal: [{value: '', disabled: this.disabled}, Validators.required],
        description: [{value: '', disabled: this.disabled}, Validators.required],
        archivementDateTime: [{value: '', disabled: this.disabled}, Validators.required],
        idTasklist: [{value: '', disabled: this.disabled}, Validators.required]
      });
      this.goal = this.formGroup.controls.goal;
      this.description = this.formGroup.controls.description;
      this.archivementDateTime = this.formGroup.controls.archivementDateTime;
      this.idTasklist = this.formGroup.controls.idTasklist;
    }

    getUserLists(): void{
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

    save(): void{
      if (this.formGroup.valid){
        this.isLoading = true;
        if (this.task._id){
          this.taskService.update(this.data.task).subscribe({
            next: (data: any) => {
              this.manageSuccess(data);
            },
            error: (error: any) => {
              this.manageError(error);
            }
          });
        }else{
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
    }

    onDate(event): void{
      this.task.archivementDateTime = event;
    }


    private manageSuccess(data: any): void{
      if (data.type === 'SUCCESS'){
        setTimeout(() => {
          this.isLoading = false;
          this.dialogRef.close({task:  data.task});
        }, 1000);
      }
    }
    private manageError(error: any): void{

      switch (error.type) {
              case 'ERROR': {
                 this.snackbar.open(error.error);
              }             break;
              case 'VALIDATION_ERROR': {
                Object.keys(this.errors).forEach((key) => {
                  this.formGroup.controls[key].setErrors({invalid: true});

                  this.errors[key] = error.error[key];
                });

              }                        break;
              default: {
                this.snackbar.open('Ha ocurrido un error inseperado, intentelo de nuevo más tarde');
              }        break;
           }
      setTimeout(() => {
         this.snackbar.dismiss();
         this.isLoading = false;

          }, 1000);
    }
}
