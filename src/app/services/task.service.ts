import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  public  headers:HttpHeaders;
  

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getTimeline(lastTask:string): Observable<any>{
    return this.http.get( `https://localhost:3443/auth/timeline/${lastTask}`, {headers: this.headers})
                .pipe(
                    map((data:any) => {return data}),
                    catchError(data => {return throwError(data.error)}),
                );
               
    }
}
