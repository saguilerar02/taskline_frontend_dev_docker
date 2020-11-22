import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
      return this.http.get( `https://localhost:3443/auth/lists`, {headers: this.headers})
                  .pipe(
                      map((data:any) => {return data}),
                      catchError(data => {return throwError(data.error)}),
                  );
    }

    
    create(dto:ListDTO){
      return this.http.put( `https://localhost:3443/auth/list/create`,dto, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }

    
}
