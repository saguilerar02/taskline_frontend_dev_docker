import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListDTO } from 'src/app/dtos/list.dto';
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
    public disabled:boolean;

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
     

      this.task = data.task;
      if(this.task.createdBy){
        this.disabled = appUtils.createdByUser(this.task.createdBy)
      }
      this.task.archivementDateTime= new Date(this.task.archivementDateTime);
      if(this.task._id){
        this.task.idTasklist =  this.task.idTasklist._id
      }
      

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
      this.formGroup = this.fb.group({
        goal: [{value:'',disabled:this.disabled}, Validators.required],
        description: [{value:'',disabled:this.disabled}, Validators.required],
        archivementDateTime: [{value:'',disabled:this.disabled}, Validators.required],
        idTasklist: [{value:'',disabled:this.disabled}, Validators.required]
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
        if(this.task._id){
          this.taskService.update(this.task).subscribe({
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

    onDate(event){
      this.task.archivementDateTime = event;
    }


    private manageSuccess(data: any){
      if (data.type === 'SUCCESS'){
        setTimeout(() => {
          this.isLoading = false;
          this.task = data.task;
          this.dialogRef.close({task: this.task});
        }, 1000);
      }
    }
    private manageError(error: any){

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
