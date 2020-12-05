import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ReminderDTO } from 'src/app/dtos/reminder.dto';
import { ToolbarProfileDTO } from 'src/app/dtos/toolbarProfile.dto';
import { ReminderService } from 'src/app/services/reminder.service';

@Component({
  selector: 'app-add-reminders-dialog',
  templateUrl: './add-reminder-dialog.component.html',
  styleUrls: ['./add-reminder-dialog.component.scss']
})
export class AddRemindersDialogComponent implements OnInit {

  public reminder: ReminderDTO;
  public isLoading: boolean;
  public formGroup: FormGroup;
  public filteredOptions: Observable<Array<ToolbarProfileDTO>[]>;

  public remindAt: AbstractControl;
  public reminderData: AbstractControl;
  public errors: {
    remindAt: string,
    reminderData: string
  };

  constructor(
    public dialogRef: MatDialogRef<AddRemindersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reminderService: ReminderService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder) {

      this.reminder = new ReminderDTO();
      this.reminder.idTask = this.data.task._id
      this.errors = {
        remindAt : null,
        reminderData : null
      };
    }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      remindAt: ['', Validators.required],
      reminderData: ['', Validators.required]
    });
    this.remindAt =  this.formGroup.controls.remindAt;
    this.reminderData =  this.formGroup.controls.reminderData;
  }

  deleteReminder(id: string): void{
    this.isLoading = true;
    this.reminderService.delete(id).subscribe({
      next: (data: any) => {
        if (data.type === 'SUCCESS'){
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss(); 
            this.data.task.reminders = this.data.task.reminders.filter((r) => r._id !== id);
          }, 2000);
        }
      },
      error: (error) => {
        if (error.type === 'ERROR'){
          this.snackbar.open(error.error);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
           }, 2000);
        }
      }
    });
  }

  createReminder(): void{
    this.reminder.idTask = this.data.task._id
    this.isLoading = true;
    this.reminderService.create(this.reminder).subscribe({
      next: (data) => {
        if (data.type === 'SUCCESS'){
          this.snackbar.open(data.msg);
          setTimeout(() => {
            this.isLoading = false;
            this.snackbar.dismiss();
            this.data.task.reminders.push(data.reminder);
            this.reminder = new ReminderDTO();
           }, 2000);
        }
      },
      error: (error) => {
        console.log(error);
        switch (error.type){
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
          this.isLoading = false;
          this.snackbar.dismiss(); }, 2000);
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
}
