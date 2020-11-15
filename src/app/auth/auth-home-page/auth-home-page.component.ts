import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarProfileDTO } from 'src/app/dtos/toolbarProfile.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {

  public user: ToolbarProfileDTO;
  public userLists:any;
  public sidenavRoutes: any[] = [
        {title: 'Home', route: '/auth/home', icon:'home'},
        {title: 'Mis Listas', route: '/auth/lists'},
        {title: 'Home', route: '/auth/home'},
        {title: 'Home', route: '/auth/home'},
      ];

  constructor(public userService: UsersService, private router: Router) {
    this.user = new ToolbarProfileDTO();
   }

  ngOnInit(): void {
    this.displayUserDTO();
  }

  displayUserDTO(): void{

    this.userService.getUserDTO().subscribe({
      next: (data: any) => {
        if (data.user){
          this.user = data.user;
          this.user.img = this.user.img;
        }
      }
    });
  }

  navigateTo(route: string): void{
    this.router.navigateByUrl(route);
  }

}
