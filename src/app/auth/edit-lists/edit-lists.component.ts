import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListDTO } from 'src/app/dtos/list.dto';
import { TasklistService } from 'src/app/services/tasklist.service';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-edit-lists',
  templateUrl: './edit-lists.component.html',
  styleUrls: ['./edit-lists.component.scss']
})
export class EditListsComponent implements OnInit {

  public dto: ListDTO;
  public lists: Array<ListDTO>;
  public saveListGroup: FormGroup;
  public name: AbstractControl;
  public errors: string;
  isLoading: boolean;
  public dialogRef: MatDialogRef<CreateTaskDialogComponent>;

  constructor(public listsService: TasklistService, public  snackbar: MatSnackBar, public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.lists = data.lists;
    this.dto = new ListDTO();
   }

  ngOnInit(): void {
    this.saveListGroup = this.fb.group({
      name: ['', Validators.required],
    });


    this.name = this.saveListGroup.controls.name;
    this.dto = new ListDTO();
  }
   onNoClick(): void {
        this.dialogRef.close();
      }

  getErrorMessage(key: string): string {
    if (this.saveListGroup.get(key).hasError('required')){
      return `El campo es requerido`;
    }
    if (this.saveListGroup.get(key).hasError('invalid')){
      return this.errors[key];
    }
  }
    createList(){
      this.listsService.create(this.dto).subscribe({
        next: (data: any) => {
          this.manageSuccess(data);
        },
        error: (error: any) => {
          this.manageError(error);
        }
      });
    }


    private manageSuccess(data: any){
      if (data.type === 'SUCCESS'){
        this.snackbar.open(data.msg);
        this.lists.push(data.list)
        this.data.subject.next(this.lists);
        setTimeout(() => {
          this.isLoading = false;
          this.snackbar.dismiss();
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
                  this.saveListGroup.controls[key].setErrors({invalid: true});

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

    delete(list:ListDTO){
      this.listsService.delete(list._id).subscribe({
        next: (data: any) => {
          if (data.type === 'SUCCESS'){
            this.lists = this.lists.filter((l) => l._id !== list._id);
            this.data.subject.next(this.lists);

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
