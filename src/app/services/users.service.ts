
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import {map,catchError} from 'rxjs/operators'
import { LoginDTO } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';

@Injectable()
export class UsersService {
  public  headers:HttpHeaders;
  

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  login(dto: LoginDTO): Observable<string>{
    console.log(dto)
    return this.http.post( `https://localhost:3443/public/signin`, dto, {headers: this.headers})
                .pipe(
                    map((data:any) => {
                      console.log(data);
                      return data}),
                    catchError(data => {
                      console.log(data);
                      return throwError(data.error)}),
                );
               
    }
   register(dto: RegisterDTO): Observable<string>{
    return this.http.post( `https://localhost:3443/public/signup`, dto, {headers: this.headers})
                .pipe(
                    map((data:any) => data),
                    catchError(data => throwError(data.error)),
                );
               
    }
}
