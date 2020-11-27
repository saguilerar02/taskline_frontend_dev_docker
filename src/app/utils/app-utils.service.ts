import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppUtilsService {

  constructor() { }

  public createdByUser(id:string): boolean{
    return localStorage.getItem('USER')!==id?true:false;
  }
}
