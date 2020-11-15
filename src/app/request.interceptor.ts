import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {


constructor(private authRouter: Router){

}

intercept(request: HttpRequest<any>, next: HttpHandler){
  request = request.clone({
      setHeaders: {
        authorization :
        `Bearer ${localStorage.getItem('AUTHTOKEN')}`
      }
    });
  return next.handle(request).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
      }
    }, error => {
      if (error instanceof HttpErrorResponse){
        if (error.status === 403){
          this.authRouter.navigateByUrl('public/login');
          localStorage.clear();
        }
      }
    }));
  }
}
