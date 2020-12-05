
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import {map, catchError} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginDTO } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { ResetPasswordDTO } from '../dtos/resetPassword.dto';
import { CompleteUserProfileDTO } from '../dtos/userProfile.dto';

@Injectable()
export class UsersService {
  public  headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  login(dto: LoginDTO): Observable<string>{
    console.log(dto);
    return this.http.post( `${environment.url_base}public/signin`, dto, {headers: this.headers})
                .pipe(
                    map((data: any) => data),
                    catchError(data => throwError(data.error)),
                );

    }
  register(dto: RegisterDTO): Observable<string>{
  return this.http.post( `${environment.url_base}public/signup`, dto, {headers: this.headers})
              .pipe(
                  map((data: any) => data),
                  catchError(data => throwError(data.error)),
              );

  }

  sendMailResetPassword(dto: LoginDTO): Observable<string>{
    return this.http.post( `${environment.url_base}public/resetpassword`, dto, {headers: this.headers})
                .pipe(
                    map((data: any) => data),
                    catchError(data => throwError(data.error)),
                );

  }

  resetPassword(dto: ResetPasswordDTO, user: string, token: string): Observable<string>{
    return this.http.post( `${environment.url_base}public/resetpassword/${user}/${token}`, dto, {headers: this.headers})
                .pipe(
                    map((data: any) => data),
                    catchError(data => throwError(data.error)),
                );

  }

  getUserDTO(): Observable<any>{
    return this.http.get( `${environment.url_base}auth/userDTO`, {headers: this.headers})
                .pipe(
                    map((data: any) => data),
                    catchError(data => throwError(data.error)),
                );

  }
  getUserProfile(): Observable<any>{
    return this.http.get( `${environment.url_base}auth/profile`, {headers: this.headers})
                .pipe(
                    map((data: any) => data),
                    catchError(data => throwError(data.error)),
                );
  }

  updateUser(dto: CompleteUserProfileDTO): Observable<any>{
    return this.http.put( `${environment.url_base}auth/profile`, dto, {headers: this.headers})
    .pipe(
        map((data: any) => data),
        catchError(data => throwError(data.error)),
    );
  }


  updateProfileImage(image: FormData): Observable<any>{
    return this.http.put( `${environment.url_base}auth/upload`, image)
    .pipe(
        map((data: any) => data),
        catchError(data => throwError(data.error)),
    );
  }

  getUsersByFilter(username: string): Observable<any>{
    return this.http.get( `${environment.url_base}auth/users/${username}`, {headers: this.headers})
    .pipe(
        map((data: any) => data),
        catchError(data => throwError(data.error)),
    );
  }
}
