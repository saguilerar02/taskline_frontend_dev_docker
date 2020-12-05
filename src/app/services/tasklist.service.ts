import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ListDTO } from '../dtos/list.dto';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  public  headers:HttpHeaders;
  

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

    getUserLists(): Observable<any>{
      return this.http.get( `${environment.url_base}auth/lists`, {headers: this.headers})
                  .pipe(
                      map((data:any) => {return data}),
                      catchError(data => {return throwError(data.error)}),
                  );
    }

    
    create(dto:ListDTO){
      return this.http.post( `${environment.url_base}auth/list/create`,dto, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }

    update(dto:ListDTO){
      return this.http.put( `${environment.url_base}auth/list/update/${dto._id}`,dto, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }
    delete(id:string){
      return this.http.delete( `${environment.url_base}auth/list/delete/${id}`, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }

    
}
