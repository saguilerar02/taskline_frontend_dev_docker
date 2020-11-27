import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ReminderDTO } from '../dtos/reminder.dto';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  public  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  create(dto:ReminderDTO){
    return this.http.post( `https://localhost:3443/auth/reminder/create`,dto, {headers: this.headers})
    .pipe(
        map((data: any) =>data),
        catchError(data =>throwError(data.error)),
    );
  }
  delete(id:string){
    return this.http.delete( `https://localhost:3443/auth/reminder/delete/${id}`, {headers: this.headers})
    .pipe(
        map((data: any) =>data),
        catchError(data =>throwError(data.error)),
    );
  }
}
