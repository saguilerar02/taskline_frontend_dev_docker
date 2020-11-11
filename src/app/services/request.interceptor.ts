import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
intercept(request: HttpRequest<any>, next: HttpHandler){
   request = request.clone({
      setHeaders: {
        authorization : 
        `Bearer  ${localStorage.getItem("AUTHTOKEN")}`
      }
    })
    return next.handle(request);
 }
}