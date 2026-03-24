import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and add withCredentials: true
  // We clone because HttpRequest objects are immutable — can't modify directly
  const clonedReq = req.clone({
    withCredentials: true, // tells browser to send the cls_token cookie
  });
  return next(clonedReq);
};
