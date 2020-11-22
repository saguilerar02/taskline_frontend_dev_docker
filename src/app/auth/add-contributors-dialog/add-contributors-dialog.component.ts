import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TaskDTO } from 'src/app/dtos/simpleTask.dto';
import { ToolbarProfileDTO } from 'src/app/dtos/toolbarProfile.dto';
import { TaskService } from 'src/app/services/task.service';
import { UsersService } from 'src/app/services/users.service';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-add-contributors-dialog',
  templateUrl: './add-contributors-dialog.component.html',
  styleUrls: ['./add-contributors-dialog.component.scss']
})
export class AddContributorsDialogComponent implements OnInit {

  public isLoading :boolean
  public formGroup: FormGroup;
  public task: TaskDTO;
  public errors: {
    contributors: string
  };
  public contributor: AbstractControl;
  public filteredOptions: Observable<Array<ToolbarProfileDTO>[]>;

  constructor(
    public dialogRef: MatDialogRef<AddContributorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService: TaskService,
    public usersService: UsersService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private authRouter: Router,) {

      this.task = data.task;
      this.errors = {contributors : null};
     }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      contributor: ['', null]
    });

    this.contributor = this.formGroup.controls.contributor;
    this.contributor.valueChanges.pipe(
      startWith(''),
      map(value => value)
    ).subscribe((value: any) => {
        if (value){
          this._filter(value);
        }
      });
  }

  deleteContrib(id: string): void{
    this.task.contributors = this.task.contributors.filter((c) => c._id !== id);
  }

  private _filter(value: any): void{
    this.usersService.getUsersByFilter(value).subscribe(
      (data) => {if (data.users.length > 0){
        this.filteredOptions = data.users;
      }});
  }
  addToContributors(contributor: ToolbarProfileDTO): void{
    let msg = '';
    const user = localStorage.getItem('USER');
    if (contributor._id === user){
      msg = 'No puedes añadirte a ti mismo como contribuidor';
    }else{
      const c = this.task.contributors.find((c) => c._id === contributor._id);
      if (c){
        msg = 'Ya has añadido a ese usuario como contribuidor';
      }else{
        this.task.contributors.push(contributor);
        msg = `Has compartido tu tarea con  contribuidor ${contributor.username}`;
      }
    }
    this.snackbar.open(msg);
    setTimeout(() => {
      this.snackbar.dismiss();
    }, 1000);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTask(){
    this.taskService.update(this.task).subscribe({
      next:(data:any)=>{
        if (data.type === 'SUCCESS'){
          console.log('Guardado');
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
            this.dialogRef.close({task: this.data});
            this.authRouter.navigateByUrl('/auth/home');
          }, 1000);
        }
      },
      error:(error: any)=>{
        switch (error.type) {
                case 'ERROR': {
                   this.snackbar.open(error.error);
                }
                              break;
                case 'VALIDATION_ERROR': {
                  Object.keys(this.task).forEach((key) => {
                    this.formGroup.controls[key].reset();
                    this.formGroup.controls[key].setErrors({invalid: true});
                    this.errors[key] = error.error;
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
    })
  }
}
