import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { MyFormsModule } from './my-forms.module';
import { TokenInterceptor } from './request.interceptor';
import { TaskService } from './services/task.service';
import { UsersService } from './services/users.service';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MyFormsModule,
    HttpClientModule,
    AuthModule
  ],
  providers: [UsersService,TaskService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
