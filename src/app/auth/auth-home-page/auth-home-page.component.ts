import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListDTO } from 'src/app/dtos/list.dto';
import { ToolbarProfileDTO } from 'src/app/dtos/toolbarProfile.dto';
import { TasklistService } from 'src/app/services/tasklist.service';
import { UsersService } from 'src/app/services/users.service';
import { EditListsComponent } from '../edit-lists/edit-lists.component';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {

  public user: ToolbarProfileDTO;
  public lists: Array<ListDTO>;
  public subject: BehaviorSubject<Array<ListDTO>>;



  constructor(public userService: UsersService, public listsService: TasklistService, private snackbar: MatSnackBar, private router: Router, private dialog: MatDialog) {
    this.user = new ToolbarProfileDTO();
    this.lists = new Array<ListDTO>();
    this.subject = new BehaviorSubject<Array<ListDTO>>(this.lists);
   }

  ngOnInit(): void {
    this.displayUserDTO();
    this.getUserLists();
    this.subject.next(this.lists);
  }

  openListDialog(): void {
    const dialogRef = this.dialog.open(EditListsComponent, {
      height: '60vh',
      maxWidth: '75vw',
       data: {lists: this.lists, subject:this.subject}
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

  displayUserDTO(): void{

    this.userService.getUserDTO().subscribe({
      next: (data: any) => {
        if (data.user){
          this.user = data.user;
        }
      }
    });
  }

  getUserLists(){
    this.listsService.getUserLists().subscribe({
      next: (data) => {
        if (data.lists.length > 0) {
          this.lists = data.lists;
          this.subject.next(this.lists);
        }
      },
      error: (error) => {
        this.snackbar.open(error.error);
        setTimeout(() => {
          this.snackbar.dismiss();
        }, 1000);
      },

    });
  }
  navigateTo(route: string): void{
    this.router.navigateByUrl(route);
  }

  cerrarSession(){
    localStorage.clear();
    this.snackbar.open('Se ha cerrado sessión con éxito');

    setTimeout(() => {
      this.snackbar.dismiss();
      this.navigateTo('public/login');
    }, 1000);

  }
}
