import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NewTaskDTO } from '../dtos/newTask.dto';
import { TaskDTO } from '../dtos/simpleTask.dto';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  public  headers:HttpHeaders;
  

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

    getTimeline(lastTask:string, lastDate:string): Observable<any>{
      let path =`https://localhost:3443/auth/timeline/${lastTask}/${lastDate}`;
      if(lastTask.length===0 && lastDate.length===0){
        path = "https://localhost:3443/auth/timeline"
      }
     
      return this.http.get( path, {headers: this.headers})
                  .pipe(
                      map((data:any) => {return data}),
                      catchError(data => {return throwError(data.error)}),
                  );
    }

    create(dto:NewTaskDTO){
      return this.http.post( `https://localhost:3443/auth/task/create`,dto, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }
      
    update(dto:TaskDTO){
      return this.http.put( `https://localhost:3443/auth/task/update/${dto._id}`,dto, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }
    delete(id:string){
      return this.http.delete( `https://localhost:3443/auth/task/delete/${id}`, {headers: this.headers})
      .pipe(
          map((data: any) =>data),
          catchError(data =>throwError(data.error)),
      );
    }
}
