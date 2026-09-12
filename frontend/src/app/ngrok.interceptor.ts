import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.production && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }

  return next(req);
};
